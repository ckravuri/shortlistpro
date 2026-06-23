from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId
import secrets
import re
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone, ImageContent
import json
import asyncio
import base64
from utils.pdf_parser import parse_pdf_resume, parse_docx_resume
from utils.pdf_generator import generate_resume_pdf
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

# Stripe Configuration
stripe.api_key = os.environ['STRIPE_SECRET_KEY']
STRIPE_PRO_PRICE_ID = os.environ['STRIPE_PRO_PRICE_ID']
STRIPE_PRO_PLUS_PRICE_ID = os.environ['STRIPE_PRO_PLUS_PRICE_ID']
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')

# Rate Limiting Setup
limiter = Limiter(key_func=get_remote_address)

# Create the main app
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")

# ============ AUTH UTILITIES ============
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        # CRITICAL FIX: Use custom 'id' field, NOT '_id' with ObjectId
        user_id = payload["sub"]
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ MODELS ============
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    region: str = "US"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    website: str = ""
    summary: str = ""

class WorkExperience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str = ""
    position: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    achievements: List[str] = []

class Education(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution: str = ""
    degree: str = ""
    field: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""

class ResumeCreate(BaseModel):
    title: str = "My Resume"
    region: str = "US"

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    personal_info: Optional[PersonalInfo] = None
    work_experience: Optional[List[WorkExperience]] = None
    education: Optional[List[Education]] = None
    skills: Optional[List[str]] = None
    region: Optional[str] = None

class AISuggestionRequest(BaseModel):
    context: str
    field: str
    current_text: str = ""

# ============ STARTUP EVENTS ============
@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@shortlistpro.cv")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@2026Secure")
    existing = await db.users.find_one({"email": admin_email})
    
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "region": "US",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info("Admin password updated")
    
    # Write test credentials
    Path("/app/memory").mkdir(exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/register\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- GET /api/auth/me\n")
        f.write(f"- POST /api/auth/logout\n")

# ============ AUTH ROUTES ============
@api_router.post("/auth/register")
@limiter.limit("5/hour")  # Prevent bot account creation
async def register(user: UserRegister, response: Response, request: Request):
    email_lower = user.email.lower()
    existing = await db.users.find_one({"email": email_lower})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    user_doc = {
        "email": email_lower,
        "password_hash": hashed,
        "name": user.name,
        "region": user.region,
        "role": "user",
        "subscription_tier": "free",
        "subscription_status": "active",
        "headshot_url": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user_id,
        "email": email_lower,
        "name": user.name,
        "region": user.region,
        "role": "user",
        "subscription_tier": "free"
    }

@api_router.post("/auth/login")
@limiter.limit("10/minute")  # Prevent brute force attacks
async def login(user: UserLogin, request: Request, response: Response):
    email_lower = user.email.lower()
    
    # Check brute force
    client_ip = request.client.host
    identifier = f"{client_ip}:{email_lower}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    
    if attempt and attempt.get("attempts", 0) >= 5:
        lockout_until = attempt.get("lockout_until")
        if lockout_until and datetime.fromisoformat(lockout_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again later.")
    
    user_doc = await db.users.find_one({"email": email_lower})
    if not user_doc or not verify_password(user.password, user_doc["password_hash"]):
        # Increment failed attempts
        if attempt:
            new_attempts = attempt.get("attempts", 0) + 1
            update_doc = {"attempts": new_attempts}
            if new_attempts >= 5:
                update_doc["lockout_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            await db.login_attempts.update_one(
                {"identifier": identifier},
                {"$set": update_doc}
            )
        else:
            await db.login_attempts.insert_one({
                "identifier": identifier,
                "attempts": 1,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Clear failed attempts
    await db.login_attempts.delete_one({"identifier": identifier})
    
    user_id = str(user_doc["_id"])
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user_id,
        "email": user_doc["email"],
        "name": user_doc["name"],
        "region": user_doc.get("region", "US"),
        "role": user_doc.get("role", "user")
    }

@api_router.get("/auth/me")
async def get_me(request: Request, current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}

# ============ GOOGLE OAUTH ROUTES ============
@api_router.post("/auth/google")
async def google_auth(request: Request, response: Response):
    """Verify Google ID token and create/login user"""
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    
    data = await request.json()
    token = data.get("credential")
    
    if not token:
        raise HTTPException(status_code=400, detail="Google credential required")
    
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Extract user info from token
        email = idinfo['email'].lower()
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        google_id = idinfo['sub']
        
        # Find or create user
        user = await db.users.find_one({"email": email}, {"_id": 0})
        
        if not user:
            # Create new user with Google OAuth
            user_id = str(uuid.uuid4())
            new_user = {
                "_id": ObjectId(),
                "id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "google_id": google_id,
                "region": "US",
                "subscription_tier": "free",
                "stripe_customer_id": None,
                "ai_suggestions_used": 0,
                "role": "user",
                "auth_provider": "google",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(new_user)
            user = {k: v for k, v in new_user.items() if k != "_id"}
        else:
            # Update existing user's picture and google_id if changed
            update_fields = {}
            if picture and user.get("picture") != picture:
                update_fields["picture"] = picture
            if not user.get("google_id"):
                update_fields["google_id"] = google_id
            if not user.get("auth_provider"):
                update_fields["auth_provider"] = "google"
            
            if update_fields:
                await db.users.update_one(
                    {"email": email},
                    {"$set": update_fields}
                )
                user.update(update_fields)
        
        # Create JWT tokens (reuse existing auth system)
        user_id = user["id"]
        access_token = create_access_token(user_id, email)
        refresh_token = create_refresh_token(user_id)
        
        # Set cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=900,  # 15 minutes
            path="/"
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7*24*60*60,  # 7 days
            path="/"
        )
        
        # Return user data
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture", ""),
            "region": user["region"],
            "subscription_tier": user["subscription_tier"],
            "role": user["role"]
        }
        
    except ValueError as e:
        # Invalid token
        logging.error(f"Google token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Google token")
    except Exception as e:
        logging.error(f"Google OAuth error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

# ============ RESUME ROUTES ============
@api_router.post("/resumes")
async def create_resume(resume: ResumeCreate, current_user: dict = Depends(get_current_user)):
    resume_doc = {
        "user_id": current_user["id"],
        "title": resume.title,
        "region": resume.region,
        "personal_info": {},
        "work_experience": [],
        "education": [],
        "skills": [],
        "ats_score": 0,
        "keywords": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.resumes.insert_one(resume_doc)
    resume_doc["id"] = str(result.inserted_id)
    resume_doc.pop("_id", None)
    return resume_doc

@api_router.get("/resumes")
async def get_resumes(current_user: dict = Depends(get_current_user)):
    resumes = await db.resumes.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    for resume in resumes:
        if "_id" in resume:
            resume["id"] = str(resume["_id"])
            resume.pop("_id")
    return resumes

@api_router.get("/resumes/{resume_id}")
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume["id"] = resume_id
    return resume

@api_router.put("/resumes/{resume_id}")
async def update_resume(resume_id: str, update: ResumeUpdate, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    update_doc = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if update.title:
        update_doc["title"] = update.title
    if update.personal_info:
        update_doc["personal_info"] = update.personal_info.model_dump()
    if update.work_experience is not None:
        update_doc["work_experience"] = [exp.model_dump() for exp in update.work_experience]
    if update.education is not None:
        update_doc["education"] = [edu.model_dump() for edu in update.education]
    if update.skills is not None:
        update_doc["skills"] = update.skills
    if update.region:
        update_doc["region"] = update.region
    
    # Calculate ATS score
    old_score = resume.get("ats_score", 0)
    ats_score = calculate_ats_score(update_doc, resume)
    update_doc["ats_score"] = ats_score
    
    await db.resumes.update_one({"_id": ObjectId(resume_id)}, {"$set": update_doc})
    
    # Track score history if score changed
    if ats_score != old_score:
        await db.score_history.insert_one({
            "resume_id": resume_id,
            "score": ats_score,
            "date": datetime.now(timezone.utc).isoformat()
        })
    
    updated_resume = await db.resumes.find_one({"_id": ObjectId(resume_id)}, {"_id": 0})
    updated_resume["id"] = resume_id
    return updated_resume

@api_router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.resumes.delete_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}

# ============ AI SUGGESTION (Streaming) ============
@api_router.post("/resumes/{resume_id}/ai-suggest")
@limiter.limit("20/hour")  # Prevent AI abuse - 20 suggestions per hour
async def ai_suggest(resume_id: str, request: AISuggestionRequest, current_user: dict = Depends(get_current_user), req: Request = None):
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    region = resume.get("region", "US")
    
    system_prompt = f"""
You are an expert resume writer for {region} job markets. Your role is to provide professional, accurate suggestions.

CRITICAL RULES:
1. NEVER fabricate or invent data, metrics, or achievements
2. If specific data is missing, suggest: [Add specific metric here]
3. Provide region-specific guidance for {region} standards
4. Keep suggestions concise and actionable
5. Focus on impact and quantifiable results when possible
"""
    
    user_prompt = f"""
Field: {request.field}
Context: {request.context}
Current text: {request.current_text}

Provide a professional suggestion to improve this content. If metrics are needed but not provided, flag with [Add metric here].
"""
    
    async def generate():
        try:
            chat = LlmChat(
                api_key=os.environ["EMERGENT_LLM_KEY"],
                session_id=f"resume_{resume_id}_{request.field}",
                system_message=system_prompt
            )
            chat.with_model("gemini", "gemini-3.5-flash")
            
            message = UserMessage(text=user_prompt)
            
            async for event in chat.stream_message(message):
                if isinstance(event, TextDelta):
                    yield f"data: {json.dumps({'content': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    yield f"data: {json.dumps({'done': True})}\n\n"
                    break
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

# ============ ATS SCORE CALCULATION ============
def calculate_ats_score(update_doc: dict, current_resume: dict) -> int:
    score = 0
    max_score = 100
    
    # Get the updated resume data
    personal_info = update_doc.get("personal_info", current_resume.get("personal_info", {}))
    work_experience = update_doc.get("work_experience", current_resume.get("work_experience", []))
    education = update_doc.get("education", current_resume.get("education", []))
    skills = update_doc.get("skills", current_resume.get("skills", []))
    
    # Personal info completeness (20 points)
    if personal_info:
        fields = ["full_name", "email", "phone", "location"]
        filled = sum(1 for f in fields if personal_info.get(f))
        score += int((filled / len(fields)) * 20)
    
    # Work experience (30 points)
    if work_experience:
        score += min(len(work_experience) * 10, 20)
        # Check for achievements
        has_achievements = any(exp.get("achievements") for exp in work_experience)
        if has_achievements:
            score += 10
    
    # Education (20 points)
    if education:
        score += min(len(education) * 10, 20)
    
    # Skills (20 points)
    if skills:
        score += min(len(skills) * 2, 20)
    
    # Summary (10 points)
    if personal_info and personal_info.get("summary"):
        score += 10
    
    return min(score, max_score)

@api_router.get("/resumes/{resume_id}/ats-score")
async def get_ats_score(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "score": resume.get("ats_score", 0),
        "keywords": resume.get("keywords", [])
    }

# ============ EXPORT (Placeholder) ============
@api_router.get("/resumes/{resume_id}/export/pdf")
async def export_pdf(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate PDF using ReportLab
    try:
        pdf_bytes = generate_resume_pdf(resume)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename={resume.get('title', 'resume')}.pdf"
        })
    except Exception as e:
        logger.error(f"PDF generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

# ============ FILE UPLOAD & PARSING ============
@api_router.post("/resumes/upload")
async def upload_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Upload and parse PDF/DOCX resume"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_ext = file.filename.lower().split('.')[-1]
    if file_ext not in ['pdf', 'docx']:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    file_bytes = await file.read()
    
    try:
        if file_ext == 'pdf':
            parsed_data = parse_pdf_resume(file_bytes)
        else:
            parsed_data = parse_docx_resume(file_bytes)
        
        if 'error' in parsed_data:
            raise HTTPException(status_code=400, detail=parsed_data['error'])
        
        # Create new resume with parsed data
        resume_doc = {
            "user_id": current_user["id"],
            "title": f"Imported from {file.filename}",
            "region": current_user.get("region", "US"),
            "personal_info": {
                "full_name": parsed_data.get("full_name", ""),
                "email": parsed_data.get("email", ""),
                "phone": parsed_data.get("phone", ""),
                "location": parsed_data.get("location", ""),
                "linkedin": parsed_data.get("linkedin", ""),
                "website": parsed_data.get("website", ""),
                "summary": parsed_data.get("summary", "")
            },
            "work_experience": parsed_data.get("work_experience", []),
            "education": parsed_data.get("education", []),
            "skills": parsed_data.get("skills", []),
            "ats_score": 0,
            "keywords": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = await db.resumes.insert_one(resume_doc)
        resume_doc["id"] = str(result.inserted_id)
        resume_doc.pop("_id", None)
        
        # Calculate initial ATS score
        ats_score = calculate_ats_score(resume_doc, {})
        await db.resumes.update_one({"_id": result.inserted_id}, {"$set": {"ats_score": ats_score}})
        resume_doc["ats_score"] = ats_score
        
        # Track score history
        await db.score_history.insert_one({
            "resume_id": str(result.inserted_id),
            "score": ats_score,
            "date": datetime.now(timezone.utc).isoformat()
        })
        
        return resume_doc
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

# ============ SCORE HISTORY ============
@api_router.get("/resumes/{resume_id}/score-history")
async def get_score_history(resume_id: str, current_user: dict = Depends(get_current_user)):
    """Get ATS score history for a resume"""
    # Verify resume ownership
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(resume_id)})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    history = await db.score_history.find({"resume_id": resume_id}, {"_id": 0}).sort("date", 1).to_list(100)
    return history

# ============ STAR BUILDER ============
class STAREntry(BaseModel):
    situation: str = ""
    task: str = ""
    action: str = ""
    result: str = ""
    job_title: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

@api_router.post("/star-entries")
async def create_star_entry(entry: STAREntry, current_user: dict = Depends(get_current_user)):
    """Create a STAR format entry"""
    entry_doc = entry.model_dump()
    entry_doc["user_id"] = current_user["id"]
    entry_doc["id"] = str(uuid.uuid4())
    
    await db.star_entries.insert_one(entry_doc)
    return entry_doc

@api_router.get("/star-entries")
async def get_star_entries(current_user: dict = Depends(get_current_user)):
    """Get all STAR entries for user"""
    entries = await db.star_entries.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    return entries

@api_router.delete("/star-entries/{entry_id}")
async def delete_star_entry(entry_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a STAR entry"""
    result = await db.star_entries.delete_one({"user_id": current_user["id"], "id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry deleted successfully"}

# ============ AI HEADSHOT GENERATOR ============
class HeadshotRequest(BaseModel):
    image_data: str  # base64 encoded image

@api_router.post("/generate-headshot")
@limiter.limit("10/hour")  # Limit headshot generation - resource intensive
async def generate_headshot(request: HeadshotRequest, current_user: dict = Depends(get_current_user), req: Request = None):
    """Generate professional headshot from selfie using Gemini Nano Banana"""
    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"headshot_{current_user['id']}",
            system_message="You are a professional photo editor."
        )
        chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
        
        # Remove data URL prefix if present
        image_base64 = request.image_data
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        message = UserMessage(
            text="Convert this selfie into a professional corporate headshot. Keep the person's face, improve lighting, add professional background blur, business casual attire if visible. Maintain natural appearance.",
            file_contents=[ImageContent(image_base64)]
        )
        
        text, images = await chat.send_message_multimodal_response(message)
        
        if images and len(images) > 0:
            # Save headshot URL to user profile
            headshot_data = f"data:image/png;base64,{images[0]['data']}"
            await db.users.update_one(
                {"_id": ObjectId(current_user["id"])},
                {"$set": {"headshot_url": headshot_data}}
            )
            return {"headshot_url": headshot_data, "message": text}
        else:
            raise HTTPException(status_code=500, detail="No image generated")
    except Exception as e:
        logger.error(f"Headshot generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate headshot: {str(e)}")

# ============ JOB AD GENERATOR ============
class JobAdRequest(BaseModel):
    job_description: str
    resume_id: str

@api_router.post("/generate-from-job-ad")
@limiter.limit("15/hour")  # Limit job ad generation
async def generate_from_job_ad(request: JobAdRequest, current_user: dict = Depends(get_current_user), req: Request = None):
    """Generate tailored resume and cover letter from job description"""
    # Get user's resume
    resume = await db.resumes.find_one({"user_id": current_user["id"], "_id": ObjectId(request.resume_id)}, {"_id": 0})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    system_prompt = f"""You are an expert resume and cover letter writer. 
Given a job description and a candidate's resume, create:
1. A tailored professional summary highlighting relevant skills
2. A tailored cover letter (3-4 paragraphs)

Region: {resume.get('region', 'US')}
CRITICAL: Never fabricate experience or skills. Only highlight what's in the resume.
"""
    
    resume_text = json.dumps({
        "personal_info": resume.get("personal_info", {}),
        "work_experience": resume.get("work_experience", []),
        "education": resume.get("education", []),
        "skills": resume.get("skills", [])
    }, indent=2)
    
    user_prompt = f"""
Job Description:
{request.job_description}

Candidate's Resume:
{resume_text}

Generate:
1. Tailored Professional Summary (2-3 sentences)
2. Cover Letter (3-4 paragraphs)

Format as JSON:
{{
  "summary": "...",
  "cover_letter": "..."
}}
"""
    
    async def generate():
        try:
            chat = LlmChat(
                api_key=os.environ["EMERGENT_LLM_KEY"],
                session_id=f"jobad_{current_user['id']}",
                system_message=system_prompt
            )
            chat.with_model("gemini", "gemini-3.5-flash")
            
            message = UserMessage(text=user_prompt)
            
            accumulated = ""
            async for event in chat.stream_message(message):
                if isinstance(event, TextDelta):
                    accumulated += event.content
                    yield f"data: {json.dumps({'content': event.content})}\\n\\n"
                elif isinstance(event, StreamDone):
                    yield f"data: {json.dumps({'done': True, 'full_content': accumulated})}\\n\\n"
                    break
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\\n\\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

# ============ COVER LETTER GENERATOR ============
class CoverLetterRequest(BaseModel):
    fullName: str = ""
    jobTitle: str
    companyName: str
    jobDescription: str = ""
    skills: str = ""
    experience: str = ""

@api_router.post("/generate-cover-letter")
@limiter.limit("15/hour")
async def generate_cover_letter(request: CoverLetterRequest, current_user: dict = Depends(get_current_user), req: Request = None):
    """Generate a professional cover letter"""
    system_prompt = f"""You are an expert cover letter writer. Create professional, personalized cover letters that:
- Highlight relevant experience and skills
- Show enthusiasm for the role and company
- Are concise (3-4 paragraphs)
- Use professional language
- Follow standard business letter format

Region: {current_user.get('region', 'US')}
"""
    
    user_prompt = f"""
Create a professional cover letter for:

Applicant: {request.fullName or 'the candidate'}
Position: {request.jobTitle}
Company: {request.companyName}
{f'Skills: {request.skills}' if request.skills else ''}
{f'Experience: {request.experience}' if request.experience else ''}
{f'Job Description: {request.jobDescription}' if request.jobDescription else ''}

Write a compelling cover letter that makes the candidate stand out.
"""
    
    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"coverletter_{current_user['id']}",
            system_message=system_prompt
        )
        chat.with_model("gemini", "gemini-3.5-flash")
        
        message = UserMessage(text=user_prompt)
        
        accumulated = ""
        async for event in chat.stream_message(message):
            if isinstance(event, TextDelta):
                accumulated += event.content
            elif isinstance(event, StreamDone):
                break
        
        return {"cover_letter": accumulated}
    except Exception as e:
        logging.error(f"Cover letter generation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate cover letter")

# ============ ADMIN DASHBOARD ============
@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    """Get admin dashboard statistics"""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Total users
    total_users = await db.users.count_documents({})
    
    # Users by subscription tier
    free_users = await db.users.count_documents({"subscription_tier": {"$in": ["free", None]}})
    pro_users = await db.users.count_documents({"subscription_tier": "pro"})
    pro_plus_users = await db.users.count_documents({"subscription_tier": "pro+"})
    
    # Total resumes
    total_resumes = await db.resumes.count_documents({})
    
    # Recent users (last 30 days)
    thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    recent_users = await db.users.count_documents({"created_at": {"$gte": thirty_days_ago}})
    
    # Get all users with basic info
    users_list = await db.users.find(
        {},
        {"_id": 0, "id": {"$toString": "$_id"}, "email": 1, "name": 1, "created_at": 1, "subscription_tier": 1, "role": 1}
    ).sort("created_at", -1).to_list(1000)
    
    return {
        "total_users": total_users,
        "subscription_breakdown": {
            "free": free_users,
            "pro": pro_users,
            "pro_plus": pro_plus_users
        },
        "total_resumes": total_resumes,
        "recent_users_30d": recent_users,
        "users": users_list
    }

# ============ STRIPE INTEGRATION ============

# Subscription tier limits
TIER_LIMITS = {
    "free": {
        "max_resumes": 3,
        "max_ai_suggestions": 5,
        "max_pdf_exports": 3,
        "features": ["basic_resume_builder", "basic_ats_score"]
    },
    "pro": {
        "max_resumes": -1,  # unlimited
        "max_ai_suggestions": -1,
        "max_pdf_exports": -1,
        "features": ["resume_upload", "ats_history", "star_builder", "job_ad_generator"]
    },
    "pro+": {
        "max_resumes": -1,
        "max_ai_suggestions": -1,
        "max_pdf_exports": -1,
        "features": ["resume_upload", "ats_history", "star_builder", "job_ad_generator", "headshot_generator"]
    }
}

class SubscriptionTier(BaseModel):
    tier: str  # "pro" or "pro+"

@api_router.post("/create-checkout-session")
async def create_checkout_session(tier_data: SubscriptionTier, current_user: dict = Depends(get_current_user)):
    """Create Stripe checkout session for subscription"""
    try:
        price_id = STRIPE_PRO_PRICE_ID if tier_data.tier == "pro" else STRIPE_PRO_PLUS_PRICE_ID
        
        checkout_session = stripe.checkout.Session.create(
            customer_email=current_user["email"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="subscription",
            success_url=f"{os.environ['FRONTEND_URL']}/dashboard?checkout=success",
            cancel_url=f"{os.environ['FRONTEND_URL']}/pricing?checkout=cancelled",
            metadata={
                "user_id": current_user["id"],
                "tier": tier_data.tier
            }
        )
        
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/create-portal-session")
async def create_portal_session(current_user: dict = Depends(get_current_user)):
    """Create Stripe customer portal session for subscription management"""
    try:
        # Find customer by email
        customers = stripe.Customer.list(email=current_user["email"], limit=1)
        
        if not customers.data:
            raise HTTPException(status_code=404, detail="No subscription found")
        
        customer_id = customers.data[0].id
        
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{os.environ['FRONTEND_URL']}/dashboard"
        )
        
        return {"portal_url": portal_session.url}
    except Exception as e:
        logger.error(f"Stripe portal error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/stripe-webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks for subscription events"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            event = json.loads(payload)
        
        # Handle different event types
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            user_id = session["metadata"]["user_id"]
            tier = session["metadata"]["tier"]
            customer_id = session["customer"]
            subscription_id = session["subscription"]
            
            # Update user subscription
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "subscription_tier": tier,
                    "subscription_status": "active",
                    "subscription_stripe_customer_id": customer_id,
                    "subscription_stripe_id": subscription_id,
                    "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            logger.info(f"User {user_id} subscribed to {tier}")
        
        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            customer_id = subscription["customer"]
            status = subscription["status"]
            
            # Find user by customer ID
            user = await db.users.find_one({"subscription_stripe_customer_id": customer_id})
            if user:
                await db.users.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "subscription_status": status,
                        "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                logger.info(f"User {user['_id']} subscription updated: {status}")
        
        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            customer_id = subscription["customer"]
            
            # Find user and downgrade to free
            user = await db.users.find_one({"subscription_stripe_customer_id": customer_id})
            if user:
                await db.users.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "subscription_tier": "free",
                        "subscription_status": "canceled",
                        "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                logger.info(f"User {user['_id']} subscription canceled")
        
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/subscription-status")
async def get_subscription_status(current_user: dict = Depends(get_current_user)):
    """Get current user's subscription status and limits"""
    tier = current_user.get("subscription_tier", "free")
    limits = TIER_LIMITS.get(tier, TIER_LIMITS["free"])
    
    # Get usage counts
    resume_count = await db.resumes.count_documents({"user_id": current_user["id"]})
    
    # Get AI usage this month
    first_day = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    ai_usage = await db.ai_usage.count_documents({
        "user_id": current_user["id"],
        "created_at": {"$gte": first_day.isoformat()}
    })
    
    return {
        "tier": tier,
        "status": current_user.get("subscription_status", "active"),
        "limits": limits,
        "usage": {
            "resumes": resume_count,
            "ai_suggestions": ai_usage
        },
        "can_upgrade": tier == "free" or tier == "pro"
    }

# Include router
app.include_router(api_router)

# CORS Configuration
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in cors_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

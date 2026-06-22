import fitz
import io
from typing import Dict, List
import re

def parse_pdf_resume(pdf_bytes: bytes) -> Dict:
    """
    Parse resume from PDF bytes using PyMuPDF
    Returns structured data: name, email, phone, skills, experience, education
    """
    text = ""
    
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in pdf_document:
            text += page.get_text()
        pdf_document.close()
    except Exception as e:
        return {"error": f"Failed to parse PDF: {str(e)}"}
    
    return extract_resume_data(text)

def parse_docx_resume(docx_bytes: bytes) -> Dict:
    """
    Parse resume from DOCX bytes
    """
    try:
        from docx import Document
        doc = Document(io.BytesIO(docx_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return extract_resume_data(text)
    except Exception as e:
        return {"error": f"Failed to parse DOCX: {str(e)}"}

def extract_resume_data(text: str) -> Dict:
    """
    Extract structured data from resume text
    """
    data = {
        "full_name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": "",
        "summary": "",
        "skills": [],
        "work_experience": [],
        "education": [],
        "raw_text": text
    }
    
    # Extract email
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    if email_match:
        data["email"] = email_match.group()
    
    # Extract phone
    phone_match = re.search(r'[\+\(]?[0-9][0-9 .\-\(\)]{8,}[0-9]', text)
    if phone_match:
        data["phone"] = phone_match.group().strip()
    
    # Extract LinkedIn
    linkedin_match = re.search(r'linkedin\.com/in/[a-zA-Z0-9\-]+', text, re.IGNORECASE)
    if linkedin_match:
        data["linkedin"] = linkedin_match.group()
    
    # Extract name (first line that's not email/phone and is capitalized)
    lines = text.split('\n')
    for line in lines[:5]:
        line = line.strip()
        if len(line) > 3 and len(line) < 50 and line[0].isupper() and '@' not in line and not re.match(r'^[0-9\+\(]', line):
            data["full_name"] = line
            break
    
    # Extract skills (common section headers)
    skills_section = re.search(r'(?:SKILLS|TECHNICAL SKILLS|COMPETENCIES)[:\s]+([^\n]+(?:\n[^\n]+)*?)(?=\n\n|EXPERIENCE|EDUCATION|$)', text, re.IGNORECASE | re.MULTILINE)
    if skills_section:
        skills_text = skills_section.group(1)
        # Split by common delimiters
        skills = re.split(r'[,;•\|]', skills_text)
        data["skills"] = [s.strip() for s in skills if len(s.strip()) > 2 and len(s.strip()) < 50][:15]
    
    return data

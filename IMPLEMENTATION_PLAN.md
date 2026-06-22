# ShortlistPro.cv - Full Implementation Plan

## Features to Implement:

### 1. Resume Score History ✓
- Track ATS score changes over time
- Store in score_history collection
- Display chart in ResumeBuilder

### 2. PDF/DOCX Parsing ✓
- File upload endpoint
- PyMuPDF for PDF parsing
- python-docx for DOCX parsing
- Extract: name, email, phone, skills, experience, education

### 3. Enhanced PDF Export ✓
- ReportLab for PDF generation
- ATS-safe single-column template
- Professional formatting

### 4. STAR Builder ✓
- Dedicated page for STAR format
- Voice-to-text using Web Speech API
- S/T/A/R structured input fields

### 5. AI Headshot Generator ✓
- Gemini Nano Banana integration
- Upload selfie → generate professional headshot
- Store in user profile

### 6. Job Ad Generator ✓
- Paste job description
- AI generates tailored resume + cover letter
- Uses Gemini 3.5 Flash

### 7. Stripe 3-Tier Pricing ✓
- Free: Basic features
- Pro ($7.99/mo): AI unlimited, exports, score history
- Pro+ ($14.99/mo): Headshots, STAR builder, job ad generator
- Subscription management

### 8. Google AdSense ✓
- Show ads for Free users
- Remove for Pro/Pro+ subscribers
- Landing page + Dashboard ads

### 9. Admin Dashboard ✓
- Total users count
- Subscription tier breakdown
- Revenue analytics
- User management

### 10. Deployment Guide ✓
- MongoDB Atlas setup
- Railway deployment
- Environment variables
- Stripe configuration

## Database Schema Updates:

### users collection:
- subscription_tier: "free" | "pro" | "pro+"
- subscription_status: "active" | "canceled" | "expired"
- subscription_stripe_id: str
- subscription_end_date: datetime
- headshot_url: str (optional)

### score_history collection:
- resume_id: str
- score: int
- date: datetime

### payment_transactions collection:
- session_id: str
- user_id: str
- amount: float
- currency: str
- status: str
- payment_status: str
- created_at: datetime

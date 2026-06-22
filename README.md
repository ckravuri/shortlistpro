# ShortlistPro.cv - Professional Resume Builder SaaS

**Live Demo**: [Coming Soon]  
**Tech Stack**: React + FastAPI + MongoDB + Stripe + AI (Gemini)

---

## 🚀 Features

### Core Features
- ✅ **Smart Resume Builder** - Intuitive drag-and-drop interface
- ✅ **Real-Time ATS Scoring** - Know your resume compatibility instantly
- ✅ **AI-Powered Suggestions** - Gemini 3.5 Flash with no-fabrication guardrails
- ✅ **Score History Chart** - Track your improvements over time
- ✅ **PDF/DOCX Upload** - Parse existing resumes automatically
- ✅ **Professional PDF Export** - ATS-safe single-column templates

### Advanced Tools
- ✅ **STAR Format Builder** - For Australian Government selection criteria (with voice input)
- ✅ **AI Headshot Generator** - Turn selfies into professional photos (Gemini Nano Banana)
- ✅ **Job Ad Generator** - Tailored resume + cover letter from job descriptions
- ✅ **Country-Aware Guidance** - Optimized for US, UK, AU, EU, IN markets

### Business Features
- ✅ **3-Tier Subscription** - Free, PRO ($7.99/mo), PRO+ ($14.99/mo)
- ✅ **Stripe Integration** - Secure payments with automatic currency conversion
- ✅ **Admin Dashboard** - User analytics and subscription management
- ✅ **Google AdSense** - Monetization for free users

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Tailwind CSS
- Phosphor Icons
- Recharts (analytics)
- Stripe Checkout

**Backend:**
- FastAPI (Python)
- MongoDB (Motor async driver)
- JWT Authentication
- Stripe API
- Emergent AI Integration

**AI/ML:**
- Gemini 3.5 Flash (text generation)
- Gemini Nano Banana (image generation)
- PyMuPDF (PDF parsing)
- ReportLab (PDF generation)

**Infrastructure:**
- Railway (hosting)
- MongoDB Atlas (database)
- Stripe (payments)
- Google AdSense (ads)

---

## 📦 Setup & Deployment

### Prerequisites
- MongoDB Atlas account
- Stripe account (live keys)
- Railway account
- Domain name (optional)

### Environment Variables

See `.env.example` files in `backend/` and `frontend/` directories.

**Backend variables:**
- MongoDB Atlas connection string
- Stripe API keys (live mode)
- JWT secret
- Emergent LLM key
- Admin credentials

**Frontend variables:**
- Backend API URL
- Stripe publishable key
- AdSense client ID

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Production Deployment

See `/DEPLOYMENT_GUIDE.md` for complete instructions on:
- MongoDB Atlas setup
- Railway deployment
- Custom domain configuration
- Stripe webhook setup

---

## 💳 Subscription Tiers

### FREE
- Up to 3 resumes
- Basic resume builder
- 5 AI suggestions/month
- 3 PDF exports/month
- Ads displayed

### PRO ($7.99/month)
- Unlimited resumes
- Unlimited AI suggestions
- Resume upload (PDF/DOCX)
- ATS score history
- STAR Builder
- Job Ad Generator
- No ads

### PRO+ ($14.99/month)
- Everything in PRO
- AI Headshot Generator
- Priority AI processing
- Advanced analytics
- Priority support

---

## 🔒 Security Features

- JWT authentication with bcrypt password hashing
- Brute-force login protection
- Secure cookie-based sessions
- Stripe webhook signature verification
- No credit card data stored (PCI compliant)
- Environment variable protection

---

## 🎯 No-Fabrication AI Guarantee

Our AI **NEVER** invents data, metrics, or achievements. If information is missing, we flag it as `[Add metric here]` instead of making things up.

---

## 📊 Business Model

- **Freemium** - Free tier with ads
- **Subscription** - PRO and PRO+ monthly plans
- **Currency Agnostic** - Stripe auto-converts USD to local currency
- **Global Market** - Optimized for 5 major job markets

**Revenue Projection:**
- 100 paid users = ~$980/month (~$11,760/year)
- After Stripe fees: 2.9% + $0.30 per transaction

---

## 📄 License

Proprietary - All rights reserved

---

## 🤝 Support

For deployment help, see:
- `/DEPLOYMENT_GUIDE.md` - Full production setup
- `/STRIPE_INTEGRATION_GUIDE.md` - Stripe configuration

---

**Built with ❤️ for job seekers worldwide**

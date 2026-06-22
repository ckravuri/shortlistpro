# ShortlistPro.cv - Deployment Guide

## Prerequisites
- MongoDB Atlas account (free tier available)
- Railway account (for backend hosting)
- Vercel/Netlify account (for frontend hosting) OR deploy all on Railway
- Stripe account (when ready for payments)
- Google AdSense account (for ads)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster (512MB storage, perfect for starting)
3. Choose a cloud provider & region (AWS us-east-1 recommended)
4. Name your cluster (e.g., `shortlistpro-db`)

### Step 2: Configure Database Access
1. In Atlas → Database Access → Add New Database User
2. Create user:
   - Username: `shortlistpro_user`
   - Password: Generate strong password (save it!)
   - Database User Privileges: `Atlas admin` or `Read and write to any database`

### Step 3: Configure Network Access
1. In Atlas → Network Access → Add IP Address
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your Railway/hosting IPs

### Step 4: Get Connection String
1. In Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://shortlistpro_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name after `.net/`: 
   ```
   mongodb+srv://shortlistpro_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shortlistpro_prod?retryWrites=true&w=majority
   ```

---

## Part 2: Railway Backend Deployment

### Step 1: Prepare Repository
1. Push your code to GitHub/GitLab:
   ```bash
   git init
   git add .
   git commit -m "ShortlistPro.cv initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy on Railway
1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python/FastAPI

### Step 3: Configure Environment Variables
In Railway Dashboard → Variables, add:

```
MONGO_URL=mongodb+srv://shortlistpro_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shortlistpro_prod?retryWrites=true&w=majority
DB_NAME=shortlistpro_prod
CORS_ORIGINS=https://your-frontend-domain.com
EMERGENT_LLM_KEY=sk-emergent-4E0B23566A7Fc1c2aA
JWT_SECRET=<generate_random_64_char_string>
ADMIN_EMAIL=admin@shortlistpro.cv
ADMIN_PASSWORD=<strong_admin_password>
FRONTEND_URL=https://your-frontend-domain.com
STRIPE_API_KEY=<your_stripe_key_when_ready>
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Step 4: Generate JWT Secret
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
```

### Step 5: Set Build/Start Commands
Railway auto-detects, but verify:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Step 6: Get Railway URL
- Railway will provide a URL: `https://your-app.railway.app`
- Use this as your backend URL

---

## Part 3: Frontend Deployment (Vercel/Netlify)

### Option A: Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Framework: Create React App
4. Root Directory: `frontend`
5. Build Command: `yarn build`
6. Output Directory: `build`
7. Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   REACT_APP_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

### Option B: Railway (Full-Stack)
1. Add frontend service in same project
2. Build: `cd frontend && yarn install && yarn build`
3. Start: `npx serve -s build -l $PORT`

---

## Part 4: Google AdSense Setup

### Step 1: Apply for AdSense
1. Go to https://www.google.com/adsense/start/
2. Sign in with Google account
3. Add your website URL
4. Complete application (approval takes 1-2 weeks)

### Step 2: Get AdSense Code
1. After approval, go to AdSense Dashboard → Ads → Overview
2. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
3. Update environment variable `ADSENSE_CLIENT_ID`

### Step 3: Ad Placement
- Already integrated in Dashboard for free users
- Ads automatically hidden for Pro/Pro+ subscribers

---

## Part 5: Stripe Integration (When Ready)

### You'll add Stripe later, but here's the prep:

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Create Products**:
   - Pro: $7.99/month recurring
   - Pro+: $14.99/month recurring
3. **Get API Keys**:
   - Test: `sk_test_...`
   - Live: `sk_live_...`
4. **Update Backend**:
   - Add `STRIPE_API_KEY` to Railway env vars
   - Implement subscription endpoints (I'll help when ready)
5. **Set Webhook**:
   - URL: `https://your-app.railway.app/api/stripe-webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## Part 6: Post-Deployment Checklist

### Test All Features:
- [ ] User registration & login
- [ ] Create resume
- [ ] AI suggestions (Gemini 3.5 Flash)
- [ ] PDF export download
- [ ] Resume upload (PDF/DOCX parsing)
- [ ] STAR Builder with voice input
- [ ] Headshot Generator (Gemini Nano Banana)
- [ ] Job Ad Generator
- [ ] Admin Dashboard (admin user only)
- [ ] Score history chart
- [ ] AdSense ads showing for free users

### Security:
- [ ] Change default admin password
- [ ] Verify JWT_SECRET is random & secure
- [ ] Check CORS_ORIGINS matches frontend domain
- [ ] MongoDB IP whitelist (production)

### Monitoring:
- Railway provides logs: Dashboard → Deployments → View Logs
- MongoDB Atlas: Monitor tab for database metrics

---

## Part 7: Scaling & Maintenance

### When You Grow:
1. **MongoDB**: Upgrade from M0 (free) to M2 ($9/mo) when you hit limits
2. **Railway**: Starts at $5/mo for usage-based pricing
3. **CDN**: Add Cloudflare for static assets
4. **Caching**: Implement Redis for session storage

### Regular Maintenance:
- **Backups**: MongoDB Atlas auto-backs up M2+ tiers
- **Updates**: Keep dependencies updated
  ```bash
  cd backend && pip install --upgrade -r requirements.txt
  cd frontend && yarn upgrade
  ```
- **Logs**: Monitor Railway logs for errors
- **Analytics**: Add Google Analytics to track user behavior

---

## Part 8: Custom Domain (Optional)

### Add Custom Domain:
1. **Buy domain**: Namecheap, GoDaddy, etc.
2. **Railway**: Settings → Domains → Add Custom Domain
3. **DNS Setup**:
   - Type: CNAME
   - Name: @ (or www)
   - Value: your-app.railway.app
4. **SSL**: Railway auto-provides SSL certificates

---

## Troubleshooting

### Backend won't start:
- Check Railway logs for errors
- Verify MONGO_URL is correct
- Test connection: `mongosh "YOUR_MONGO_URL"`

### Frontend can't reach backend:
- Verify REACT_APP_BACKEND_URL in env vars
- Check CORS_ORIGINS in backend env
- Test backend: `curl https://your-app.railway.app/api/auth/me`

### MongoDB connection fails:
- Verify user/password in connection string
- Check Network Access allows your Railway IPs
- Test with MongoDB Compass

---

## Cost Estimate (Starting)

- **MongoDB Atlas M0**: Free forever (512MB)
- **Railway**: ~$5-10/month (usage-based)
- **Vercel/Netlify**: Free tier (100GB bandwidth)
- **Google AdSense**: FREE (you earn money)
- **Stripe**: FREE (they take 2.9% + 30¢ per transaction)

**Total to start**: $5-10/month until you get users paying!

---

## Support

For issues:
1. Check Railway logs
2. Check MongoDB Atlas logs
3. Test each endpoint individually with curl
4. Contact support: Railway has excellent docs & Discord

**You're ready to launch! 🚀**

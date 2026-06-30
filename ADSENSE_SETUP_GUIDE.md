# Google AdSense Integration Guide for ShortlistPro.cv

## ✅ Current Status
AdSense code structure is **ready** but requires your **Publisher ID and Ad Slot IDs**.

---

## 📋 Step-by-Step Setup

### **Step 1: Apply for Google AdSense**
1. Go to https://adsense.google.com
2. Click "Get Started"
3. Enter your website URL: `shortlistpro.cv` (or your production domain)
4. Submit application
5. **Wait for approval** (usually 1-3 days, sometimes up to 2 weeks)

### **Step 2: Get Your Publisher ID**
Once approved:
1. Log in to Google AdSense
2. Click "Ads" → "Overview"
3. Find your **Publisher ID** (format: `ca-pub-1234567890123456`)
4. Copy it!

### **Step 3: Create Ad Units**
1. In AdSense, click "Ads" → "By ad unit"
2. Click "+ New ad unit"
3. Choose **Display ads**
4. **Create 3 ad units:**
   - **Dashboard Banner** (Horizontal, 728x90 or responsive)
   - **Sidebar Ad** (Vertical, 300x600 or responsive)
   - **Footer Banner** (Horizontal, responsive)
5. For each unit, copy the **Ad Slot ID** (format: `1234567890`)

### **Step 4: Update ShortlistPro.cv Code**

#### A. Update index.html (Line 27)
**File:** `/app/frontend/public/index.html`

Find:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
```

#### B. Update AdSenseAd.jsx (Line 42)
**File:** `/app/frontend/src/components/AdSenseAd.jsx`

Find:
```javascript
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
```

Replace with your Publisher ID:
```javascript
data-ad-client="ca-pub-1234567890123456"
```

### **Step 5: Add Ads to Pages**

#### Dashboard (Show banner at top for free users)
**File:** `/app/frontend/src/pages/Dashboard.jsx`

Add import at top:
```javascript
import { AdSenseBanner } from '../components/AdSenseAd';
```

Add banner after the page heading (around line 200):
```javascript
{/* Ad Banner for Free Users */}
<AdSenseBanner 
  slot="YOUR_DASHBOARD_AD_SLOT_ID" 
  className="mb-6"
/>
```

#### Resume Builder (Show sidebar ad)
**File:** `/app/frontend/src/pages/ResumeBuilder.jsx`

Add import:
```javascript
import { AdSenseSidebar } from '../components/AdSenseAd';
```

Add in the main grid (will only show for free users):
```javascript
{/* Sidebar Ad for Free Users */}
<AdSenseSidebar 
  slot="YOUR_SIDEBAR_AD_SLOT_ID"
  className="hidden lg:block"
/>
```

---

## 🎯 Ad Behavior
- ✅ **Free users:** See ads on Dashboard, Resume Builder, Templates
- ✅ **Pro users:** NO ADS
- ✅ **Pro+ users:** NO ADS
- ✅ Responsive design (auto-adjusts to screen size)

---

## 🔍 Testing Ads

### During Development:
- Ads may show as blank or "Test Ads"
- This is normal before approval

### After Approval:
1. Create a free test account
2. Log in
3. You should see ads appear
4. **DO NOT click your own ads** (Google will ban you!)

---

## 💰 Revenue Estimates
Based on typical SaaS traffic:
- **1,000 free users/month:** ~$50-$200/month
- **10,000 free users/month:** ~$500-$2,000/month
- **100,000 free users/month:** ~$5,000-$20,000/month

*Note: Actual revenue depends on niche, geography, and ad placement*

---

## ⚠️ Important Rules

1. **Never click your own ads** - Google will ban your account
2. **Don't ask users to click ads** - Violates ToS
3. **Maintain 30% content-to-ad ratio** - Don't overload with ads
4. **Mobile-friendly required** - Your site already is ✅
5. **Original content required** - Your app qualifies ✅

---

## 🚀 Where Ads Are Placed

### Current Implementation:
- `/app/frontend/src/components/AdSenseAd.jsx` - Ad component
- `/app/frontend/public/index.html` - AdSense script loaded

### Recommended Placements:
1. **Dashboard** - Top banner (high visibility)
2. **Resume Builder** - Sidebar (non-intrusive)
3. **Templates Page** - Between template rows
4. **After Export** - Thank you page with ad

---

## 📊 Track Performance
1. Go to AdSense → Reports
2. Monitor:
   - **Impressions** (ad views)
   - **Clicks** (CTR should be 0.5-2%)
   - **RPM** (revenue per 1000 impressions)
   - **Earnings**

---

## 🐛 Troubleshooting

**Ads not showing?**
- Check browser console for errors
- Verify Publisher ID is correct
- Wait 1-2 hours after code deployment
- Check AdSense account for violations

**"Ad serving has been limited"?**
- Review AdSense Policy Center
- Fix any violations
- Wait for Google review (1-30 days)

**Low revenue?**
- Increase traffic to site
- Improve ad placements
- A/B test different ad sizes
- Focus on high-CPC regions (US, UK, Canada, Australia)

---

## ✅ Next Steps
1. Apply to AdSense (if not done)
2. Get Publisher ID
3. Create 3 ad units
4. Update code with your IDs
5. Deploy changes
6. Monitor earnings!


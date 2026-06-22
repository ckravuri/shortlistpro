# Auth-Gated App Testing Playbook

## Step 1: Create Test User & Session

```bash
mongosh --eval "
use('shortlistpro');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  region: 'US',
  subscription_tier: 'free',
  ai_suggestions_used: 0,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```bash
# Test auth endpoint
curl -X GET "https://shortlistpro-backend-65d7-production.up.railway.app/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Test protected endpoints
curl -X GET "https://shortlistpro-backend-65d7-production.up.railway.app/api/resumes" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing

```javascript
// Set cookie and navigate
await page.context().addCookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": ".up.railway.app",
    "path": "/",
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
}]);
await page.goto("https://shortlistpro-frontend-ktd1-production.up.railway.app");
```

## Quick Debug

```bash
# Check data format
mongosh "YOUR_MONGODB_URL" --eval "
use('shortlistpro');
db.users.find().limit(2).pretty();
db.user_sessions.find().limit(2).pretty();
"

# Clean test data
mongosh "YOUR_MONGODB_URL" --eval "
use('shortlistpro');
db.users.deleteMany({email: /test\.user\./});
db.user_sessions.deleteMany({session_token: /test_session/});
"
```

## Checklist

- [ ] User document has `id` field (custom UUID)
- [ ] Session `user_id` matches user's `id` exactly
- [ ] All queries exclude `_id` field
- [ ] Backend queries use `id` (not `_id`)
- [ ] API returns user data with `id` field
- [ ] Browser loads dashboard

## Success Indicators

✅ `/api/auth/me` returns user data
✅ Dashboard loads without redirect
✅ CRUD operations work

## Failure Indicators

❌ "User not found" errors
❌ 401 Unauthorized responses
❌ Redirect to login page

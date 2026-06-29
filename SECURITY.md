# 🔒 Security Guide — VendorHub

This document explains which files must stay secret, how to rotate
credentials, and what to do if sensitive data is accidentally exposed.

---

## 🚫 Files That Must NEVER Be Committed

| File | Why It's Secret |
|------|----------------|
| `backend/.env` | Contains JWT_SECRET, DB URI, email password |
| `frontend/.env` | Contains API URL (may expose internal infra) |
| `backend/uploads/` | User-uploaded files (PII — personal images) |
| `*.log` | May contain request data, emails, or tokens |

The `.gitignore` files in this project block all of these automatically.
**Always verify with `git status` before committing.**

---

## 🔑 How to Rotate the JWT_SECRET

If your JWT_SECRET is exposed, ALL active sessions must be invalidated:

```bash
# 1. Generate a new strong secret (32+ random bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 2. Replace JWT_SECRET in your .env and on Render/Railway dashboard

# 3. Restart the backend server
#    All existing tokens are instantly invalid — users must re-login
```

**Important:** There is no token blacklist in this app. Rotating the
secret is the only way to invalidate all sessions at once.

---

## 📧 How to Regenerate a Gmail App Password

If your Gmail App Password is leaked:

1. Go to https://myaccount.google.com/apppasswords
2. Find "VendorHub" (or whatever name you gave it) and click **Revoke**
3. Click **Create a new app password** and generate a fresh one
4. Update `EMAIL_PASS` in your `.env` file and on Render dashboard
5. Restart the backend

---

## 🔥 If `.env` Was Accidentally Committed

Act immediately — GitHub indexes public repos within minutes.

```bash
# Step 1: Remove .env from git history entirely
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Step 2: Force push (this rewrites history — warn collaborators)
git push origin --force --all
git push origin --force --tags

# Step 3: Rotate ALL secrets immediately (see sections above)
#   - New JWT_SECRET
#   - New Gmail App Password
#   - New MongoDB Atlas password + regenerate connection string

# Step 4: Verify .env is in .gitignore
grep ".env" .gitignore
```

> ⚠️ Even after removing from history, assume the secret is compromised
> if the repo was ever public. Always rotate credentials.

---

## 🛡️ MongoDB Atlas Security Checklist

- [ ] Use a dedicated DB user (not root) with readWrite on one DB only
- [ ] Rotate the DB password every 90 days
- [ ] IP whitelist: use `0.0.0.0/0` only for Render (no fixed IP);
      for production with fixed IPs, restrict to those IPs only
- [ ] Enable MongoDB Atlas alerts for unusual access patterns
- [ ] Enable Atlas encryption at rest

---

## 🌐 Production Hardening Checklist

- [ ] `NODE_ENV=production` is set on the server
- [ ] `JWT_SECRET` is at least 64 random characters
- [ ] `CORS_ORIGIN` is set to exact frontend domain (not `*`)
- [ ] Rate limiting is active (already configured in middleware)
- [ ] Helmet headers are active (already configured in app.js)
- [ ] No `console.log` of sensitive data in production code
- [ ] MongoDB connection string uses SRV format with Atlas
- [ ] Email credentials are stored as env vars, not in code

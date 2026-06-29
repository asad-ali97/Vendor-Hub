# 🚀 VendorHub — Complete Deployment Guide

This guide walks you through deploying VendorHub from zero to live in under 30 minutes.

**Deployment targets:**
| Layer    | Platform   | Cost  |
|----------|------------|-------|
| Frontend | Vercel     | Free  |
| Backend  | Render     | Free  |
| Database | MongoDB Atlas | Free |
| Email    | Gmail SMTP | Free  |

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:
- [ ] A GitHub account
- [ ] A Google account (for Gmail SMTP)
- [ ] Your project pushed to a GitHub repository

---

## STEP 1 — Push Your Code to GitHub

```bash
# In your project root (vendor-management/)
git init
git add .
git commit -m "Initial commit: VendorHub project"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/vendor-management.git
git branch -M main
git push -u origin main
```

> ✅ Verify your `.env` files are NOT pushed (check `.gitignore`)

---

## STEP 2 — Set Up MongoDB Atlas (Database)

1. Go to **https://mongodb.com/atlas** → Click **Try Free**
2. Sign up / log in
3. Click **Build a Database** → Choose **Free (M0)** → Select a region close to you → Click **Create**
4. **Security Quickstart:**
   - Username: `vendorhub_user`
   - Password: click **Autogenerate Secure Password** → **Copy it** (save this!)
   - Click **Create User**
5. **Network Access:**
   - Click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**
6. **Get your connection string:**
   - Click **Connect** → **Drivers** → Copy the URI
   - It looks like: `mongodb+srv://vendorhub_user:<password>@cluster0.abc123.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add the database name: `mongodb+srv://vendorhub_user:YOURPASS@cluster0.abc123.mongodb.net/vendor-management?retryWrites=true&w=majority`
   - **Save this URI — you'll need it in Step 3**

---

## STEP 3 — Deploy Backend to Render

1. Go to **https://render.com** → Sign up with GitHub
2. Click **New +** → **Web Service**
3. Click **Connect a repository** → Select your `vendor-management` repo → **Connect**
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `vendorhub-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

5. Scroll down to **Environment Variables** → Click **Add Environment Variable** for each:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | *(your Atlas URI from Step 2)* |
   | `JWT_SECRET` | *(generate below)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `https://your-app.vercel.app` *(update after Step 4)* |
   | `APP_URL` | `https://your-app.vercel.app` *(update after Step 4)* |
   | `EMAIL_HOST` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `587` |
   | `EMAIL_USER` | `your.email@gmail.com` |
   | `EMAIL_PASS` | *(your Gmail App Password from Step 5)* |
   | `EMAIL_FROM` | `VendorHub <your.email@gmail.com>` |

   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and paste it as the JWT_SECRET value.

6. Click **Create Web Service**
7. Wait 2–3 minutes for the build to finish
8. Your backend URL will be: `https://vendorhub-backend.onrender.com`
9. Test it: open `https://vendorhub-backend.onrender.com/` in your browser
   - You should see: `{"status":"OK","message":"VendorHub backend is running",...}`
10. You can also check `https://vendorhub-backend.onrender.com/health` for the same status without the message field

---

## STEP 4 — Deploy Frontend to Vercel

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New...** → **Project**
3. Find your `vendor-management` repo → Click **Import**
4. Configure the project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Click **Environment Variables** → Add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://vendorhub-backend.onrender.com/api` |

6. Click **Deploy**
7. Wait ~1 minute. Your frontend URL will be: `https://vendorhub-XXXX.vercel.app`

8. **Go back to Render** and update these two environment variables with your real Vercel URL:
   - `CORS_ORIGIN` → `https://vendorhub-XXXX.vercel.app`
   - `APP_URL` → `https://vendorhub-XXXX.vercel.app`
   - After updating, Render will auto-redeploy (takes ~1 minute)

---

## STEP 5 — Set Up Gmail App Password (Email)

This allows VendorHub to send real emails from your Gmail account.

1. Go to **https://myaccount.google.com**
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", click **2-Step Verification** → Enable it if not already on
4. Go back to **Security** → Search for **App passwords** (or go to https://myaccount.google.com/apppasswords)
5. Under "Select app" choose **Mail**
6. Under "Select device" choose **Other (custom name)** → type `VendorHub`
7. Click **Generate**
8. Copy the **16-character password** (shown once — save it!)
9. Go to **Render dashboard** → your backend service → **Environment** → update `EMAIL_PASS` with this 16-char password (you can include spaces or remove them)
10. Render will auto-redeploy

---

## STEP 6 — Seed the Database

After deployment, seed your live database with demo data:

```bash
# In your local backend/ folder, create a .env file with your production MONGODB_URI
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI to your Atlas URI, JWT_SECRET to any string

npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Admin user created: admin@vendorsystem.com / admin123
✅ Created 10 vendors
✅ Created 15 quotations
✅ Created 10 activity logs
```

---

## STEP 7 — Test Your Live App

Open your Vercel URL and verify:

- [ ] Login with `admin@vendorsystem.com` / `admin123`
- [ ] Dashboard loads with charts and stats
- [ ] Vendors page shows 10 vendors
- [ ] Quotations page shows 15 quotations
- [ ] Comparison page works (try group `grp-office-supplies-2024`)
- [ ] Create a new vendor → check activity logs
- [ ] Register a new account → check your Gmail inbox for welcome email

---

## ⚠️ Common Errors & Fixes

### "Application Error" on Render
- Check Render logs: Dashboard → your service → **Logs** tab
- Most common cause: wrong `MONGODB_URI` format or missing env vars

### CORS error in browser console
- Make sure `CORS_ORIGIN` on Render exactly matches your Vercel URL (no trailing slash)
- Example: `https://vendorhub-abc123.vercel.app` ✅
- NOT: `https://vendorhub-abc123.vercel.app/` ❌

### "Invalid token" / constant logouts
- Your `JWT_SECRET` must be the same on every Render deploy — don't regenerate it
- Check it's set correctly in Render environment variables

### Render free tier sleeps after 15 minutes
- Free Render services spin down after inactivity
- First request after sleep takes ~30 seconds (cold start)
- Fix: upgrade to Render's $7/month paid plan for always-on

### Email not sending
- Double-check Gmail App Password (16 chars, generated in Step 5)
- Make sure 2-Step Verification is ON in your Google account
- Test email: after logging in as admin, hit `GET /api/email/test` in Postman with your Bearer token

### Vercel "page not found" on refresh
- Already fixed by `vercel.json` in the frontend folder
- If missing, create `frontend/vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

---

## 🔁 Updating Your Deployed App

Every time you push to GitHub, both Vercel and Render auto-deploy:

```bash
git add .
git commit -m "your change description"
git push
```

- Vercel redeploys in ~1 minute
- Render redeploys in ~2-3 minutes

---

## 🌐 Custom Domain (Optional)

**Vercel:**
1. Dashboard → your project → **Settings** → **Domains**
2. Add your domain → follow the DNS instructions

**Render:**
1. Dashboard → your service → **Settings** → **Custom Domains**
2. Add your domain → follow the DNS instructions

---

## 📊 Final Architecture

```
User Browser
    │
    ▼
Vercel (Frontend — React/Vite)
    │  HTTPS API calls
    ▼
Render (Backend — Node/Express)
    │  Mongoose
    ▼
MongoDB Atlas (Database)
    
Render → Gmail SMTP (Emails)
```

---

## 🔑 Demo Credentials (after seeding)

```
Email:    admin@vendorsystem.com
Password: admin123
```

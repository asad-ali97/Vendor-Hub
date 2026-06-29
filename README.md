# 🏢 VendorHub — Vendor Management & Quotation System

> **Teyzix Core Internship · Task FS-2 · June Batch 2026**

A production-ready MERN Stack application for managing vendors, quotation
requests, and bid comparisons — with real email notifications, image uploads,
full authentication, and one-command deployment.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | JWT login/register, bcrypt hashing, login alert emails |
| 🏢 Vendors | Full CRUD, logo upload, search, filter, pagination |
| 📋 Quotations | Complete workflow: Pending → Submitted → Approved/Rejected |
| ⚖️ Compare | Side-by-side bid comparison, best-value highlight, PDF export |
| 📊 Dashboard | Stats cards, bar + pie charts via Recharts |
| 📝 Activities | Full audit trail with entity-type filtering |
| 📧 Emails | Welcome, login alert, quotation assigned, status change (Gmail SMTP) |
| 🖼️ Images | Avatar + vendor logo upload (local dev / Cloudinary production) |
| 📄 PDF Export | jsPDF client-side, PDFKit server-side |
| 🌙 Dark Mode | Full Tailwind dark mode toggle |
| 📱 Responsive | Mobile, tablet, and desktop layouts |

---

## 🛠️ Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · React Hook Form + Zod · Recharts · jsPDF · Axios · React Hot Toast

**Backend:** Node.js · Express.js · MongoDB + Mongoose · JWT · bcryptjs · Multer · Nodemailer · PDFKit · Cloudinary · Helmet · express-rate-limit

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone and install

```bash
git clone https://github.com/your-username/vendor-management.git
cd vendor-management

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, email vars

# Frontend
cd frontend
cp .env.example .env
# Edit .env — VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
cd backend
npm run seed          # Inserts 1 admin, 10 vendors, 15 quotations, 10 activities
npm run seed:destroy  # Wipe all data
```

### 4. Start both servers

```bash
# Terminal 1 — backend (port 5000)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

**Demo login:** `admin@vendorsystem.com` / `admin123`

---

## 📧 Gmail Email Setup (Step-by-Step)

VendorHub sends real emails via Gmail SMTP. Follow these steps:

### Step 1 — Enable 2-Step Verification
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Click **2-Step Verification** → Turn it on
3. Follow the prompts

### Step 2 — Create an App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other** as the device → type `VendorHub`
4. Click **Generate**
5. Copy the **16-character password** (e.g. `abcd efgh ijkl mnop`)

### Step 3 — Add to .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.real.email@gmail.com
EMAIL_PASS=abcdefghijklmnop    # No spaces in the 16-char password
EMAIL_FROM=VendorHub <your.real.email@gmail.com>
APP_URL=http://localhost:5173  # Changed to production URL when deployed
```

### Step 4 — Test Email Delivery

```bash
# Start the backend, then call the test endpoint (admin only):
curl -X GET http://localhost:5000/api/email/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Or use the built-in test from the API. Check the inbox at EMAIL_USER.

### Emails Sent Automatically
| Trigger | Recipient | Subject |
|---|---|---|
| User registers | New user | Welcome to VendorHub! |
| User logs in | Logged-in user | New sign-in detected |
| Quotation created | Vendor (email field) | New Quotation Request |
| Quotation Approved/Rejected | Vendor | Quotation Status Update |

---

## 🖼️ Image Upload Guide

### Profile Pictures
- Go to **Settings** → click your avatar → select an image
- Supported: JPEG, PNG, WebP · Max 2MB
- Avatar appears instantly in sidebar and profile without refresh

### Vendor Logos
- On **Add/Edit Vendor** form → click the camera icon
- Logo shows in Vendor List, Vendor Details, and Quotation Details

### Production (Cloudinary)
When `NODE_ENV=production` and Cloudinary env vars are set, all images
are stored on Cloudinary CDN instead of local disk:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret
```

Sign up free at [cloudinary.com](https://cloudinary.com) → Dashboard → copy the three values.

---

## 🌐 Deployment Guide

### Overview
| Service | Platform | URL Pattern |
|---|---|---|
| Frontend | Vercel | https://your-app.vercel.app |
| Backend | Render | https://vendorhub-backend.onrender.com |
| Database | MongoDB Atlas | mongodb+srv://... |
| Images | Cloudinary | https://res.cloudinary.com/... |

---

### Step 1 — MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create account**
2. Click **Build a Database** → choose **M0 Free**
3. Select a region → click **Create**
4. **Username/Password** tab → create DB user → save password
5. **Network Access** → Add IP Address → `0.0.0.0/0` (allow all for Render)
6. Go to cluster → **Connect** → **Drivers** → copy the SRV connection string
7. Replace `<password>` with your DB password

```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/vendor-management?retryWrites=true&w=majority
```

---

### Step 2 — Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `vendorhub-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Advanced** → **Add Environment Variables**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | your Atlas SRV string |
| `JWT_SECRET` | 64-char random string |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` *(update after Vercel deploy)* |
| `APP_URL` | `https://your-app.vercel.app` *(same)* |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `your.email@gmail.com` |
| `EMAIL_PASS` | your Gmail App Password |
| `EMAIL_FROM` | `VendorHub <your.email@gmail.com>` |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |

6. Click **Create Web Service**
7. Wait 2–3 minutes for build → copy the URL (e.g. `https://vendorhub-backend.onrender.com`)

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Environment Variables** → Add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://vendorhub-backend.onrender.com/api` |

5. Click **Deploy**
6. Copy the Vercel URL (e.g. `https://your-app.vercel.app`)

### Step 4 — Update CORS on Render

1. Go back to Render → your backend service → **Environment**
2. Update `CORS_ORIGIN` and `APP_URL` to your Vercel URL
3. Click **Save Changes** → backend redeploys automatically

---

### Step 5 — Run Seed on Production

```bash
# Set production env vars locally, then run seed:
MONGODB_URI="your_atlas_uri" node backend/src/seed/seed.js

# Or SSH into Render shell (Render Pro only) and run:
npm run seed
```

---

### Common Deployment Errors

| Error | Fix |
|---|---|
| `MongooseServerSelectionError` | Check MongoDB Atlas Network Access — whitelist `0.0.0.0/0` |
| `CORS error` on frontend | Update `CORS_ORIGIN` on Render to exact Vercel URL |
| `404` on page refresh (Vercel) | `vercel.json` already handles this — redeploy |
| `Email connection failed` | Verify Gmail 2FA is on, App Password is 16 chars (no spaces) |
| Images not loading in production | Add Cloudinary env vars to Render |
| Render app sleeps after 15 min | Upgrade to Render Starter ($7/mo) for always-on |

---

### Alternative: Deploy with Docker

```bash
# From project root
docker-compose up --build
```

Services start at:
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- MongoDB:  localhost:27017

---

## 📁 Project Structure

```
vendor-management/
├── .gitignore                    # Root git ignore
├── SECURITY.md                   # Security guide
├── docker-compose.yml            # Docker dev stack
│
├── backend/
│   ├── .gitignore
│   ├── .env.example
│   ├── .env.production.example
│   ├── Dockerfile
│   ├── Procfile                  # Railway/Heroku
│   ├── render.yaml               # Render config
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/          # auth, vendor, quotation, dashboard, activity, email, upload
│   │   ├── middleware/           # auth, error, validate, rateLimit
│   │   ├── models/               # User, Vendor, Quotation, Activity
│   │   ├── routes/               # All Express routers
│   │   ├── services/             # auth, vendor, quotation, email, storage
│   │   ├── templates/            # email.templates.js
│   │   ├── utils/                # ApiError, ApiResponse, asyncHandler, logger
│   │   ├── validators/           # express-validator rules
│   │   ├── seed/seed.js
│   │   ├── app.js
│   │   └── server.js
│   └── uploads/                  # Local image storage (gitignored)
│       ├── avatars/
│       └── vendors/
│
└── frontend/
    ├── .gitignore
    ├── .env.example
    ├── Dockerfile
    ├── vercel.json
    ├── netlify.toml
    ├── nginx.conf
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── api/axios.js
        ├── assets/illustrations/ # Custom SVG empty states
        ├── components/
        │   ├── common/           # Shared UI, VendorAvatar, EmptyState
        │   ├── layout/           # Sidebar, Navbar, Layout
        │   ├── vendors/          # VendorForm with logo upload
        │   └── quotations/       # QuotationForm
        ├── context/AuthContext.jsx
        ├── hooks/index.js
        ├── pages/                # All 14 pages
        ├── routes/AppRoutes.jsx
        └── utils/helpers.js
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | ❌ | Register new user (sends welcome email) |
| POST | /api/auth/login | ❌ | Login (sends login alert email) |
| GET | /api/auth/me | ✅ | Get current user |
| PUT | /api/auth/profile | ✅ | Update name |
| PUT | /api/auth/change-password | ✅ | Change password |
| PUT | /api/auth/avatar | ✅ | Upload profile picture |
| DELETE | /api/auth/avatar | ✅ | Remove profile picture |

### Vendors
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/vendors | List (search, filter, paginate) |
| POST | /api/vendors | Create vendor |
| GET | /api/vendors/:id | Get vendor |
| PUT | /api/vendors/:id | Update vendor |
| DELETE | /api/vendors/:id | Delete vendor |
| PUT | /api/vendors/:id/logo | Upload vendor logo |
| DELETE | /api/vendors/:id/logo | Remove vendor logo |

### Quotations
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/quotations | List (advanced filtering) |
| POST | /api/quotations | Create + notify vendor |
| GET | /api/quotations/:id | Get details |
| PUT | /api/quotations/:id | Update |
| DELETE | /api/quotations/:id | Delete |
| PATCH | /api/quotations/:id/status | Change status + notify |
| GET | /api/quotations/compare/:groupId | Side-by-side comparison |
| GET | /api/quotations/:id/export-pdf | Download PDF |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard/stats | Dashboard metrics + charts |
| GET | /api/activities | Activity logs (paginated) |
| GET | /api/email/test | Send test email (admin only) |
| GET | /api/email/check | Verify SMTP connection (admin only) |

---

## 🔑 Demo Credentials

```
Email:    admin@vendorsystem.com
Password: admin123
```

---

## 🛡️ Security

See [SECURITY.md](./SECURITY.md) for:
- Which files must never be committed
- How to rotate JWT_SECRET
- How to regenerate Gmail App Passwords
- What to do if `.env` is accidentally committed

---

## 🚧 Future Improvements

- Vendor portal (external login for vendors to submit quotes directly)
- Multi-tenant support (multiple organizations)
- Role-based access control (viewer, manager, admin)
- CSV bulk import for vendors/quotations
- In-app notification center
- Two-factor authentication
- Quotation templates
- Monthly automated reports via email

---

## 👤 Author

Built for **Teyzix Core Internship (June Batch 2026)**
Task: **FS-2 — Vendor Management & Quotation System**
Deadline: **29th June 2026**

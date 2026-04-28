# DataFolio — Automated Analytics Portfolio

> A full-stack, data-driven portfolio dashboard that automatically syncs your GitHub repositories, generates AI-powered project insights, and presents everything through a professional **Tableau / Power BI–style analytics interface**.

---

## ✨ Features

### 🤖 Automation Pipeline
- **GitHub Webhooks** — Automatically captures new repositories the moment you push to GitHub
- **AI Summarization** — Google Gemini analyzes each repo's `README.md` to extract tech stacks, feature bullets, and project insights
- **Email Approval Flow** — Sends rich HTML emails via Resend so you can **Approve** or **Discard** projects directly from your inbox

### 📊 Analytics Dashboard UI
- **KPI Cards** — Animated count-up metrics (Total Projects, Tech Stack size, AI Insights, Commits)
- **SVG Charts** — Bar chart (tech stack usage), Line chart (project growth over time), Donut chart (domain classification)
- **Activity Heatmap** — GitHub-style contribution graph with green shading
- **Real-time Search** — Search bar auto-switches to Projects view and filters by name, description, or tech
- **Tech Stack Filters** — One-click filter chips per technology with active accent highlight

### 🔐 Admin Panel
- **JWT Authentication** — Secure sign-in with password show/hide toggle
- **Forgot Password** — Security question flow (`ADMIN_SECURITY_ANSWER` stored in `.env`, verified server-side only)
- **Manual Import** — Pull any public GitHub repo on-demand via the admin UI
- **Project Management** — Edit, approve, reject, or delete projects
- **Notification Bell** — Live dropdown showing portfolio status, project count, and admin access

### 🎨 Design System
- **Monochromatic Dark Base** — `#080808` background, `#111111` cards, white typography
- **Semantic Accent Colors** — Indigo / Cyan / Emerald / Amber applied consistently across nav, charts, cards, and skill bars
- **Glassmorphism Cards** — Subtle borders, hover elevation, and colored glow on interaction
- **Inter + JetBrains Mono** — Google Fonts for crisp, modern typography

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **AI / APIs** | Google Gemini AI, GitHub REST API, Resend SMTP |
| **Security** | Helmet, Morgan, JSONWebToken, BcryptJS |
| **Charts** | Custom SVG (Bar, Line, Donut, Heatmap, Sparklines) |

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Harsh-sh7/Automated-Portfolio.git
cd Automated-Portfolio
```

### 2. Backend — Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=portfolio@yourdomain.com
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_SECURITY_ANSWER=YourSecretAnswer
```

> ⚠️ **Never commit `.env` to GitHub.** The `ADMIN_SECURITY_ANSWER` is verified server-side only and is never exposed to the frontend.

### 3. Frontend — Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Install dependencies & run

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** · Backend at **http://localhost:5001**

---

## 📁 Project Structure

```
Full-Stack-Portfolio/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Login, security Q&A, password reset
│   │   ├── projectController.js   # CRUD + GitHub import + AI summarize
│   │   └── webhookController.js   # GitHub webhook handler
│   ├── models/
│   │   ├── Admin.js               # Bcrypt-hashed admin credentials
│   │   └── Project.js             # Project schema
│   ├── routes/
│   │   ├── authRoutes.js          # /login, /verify-security, /reset-password
│   │   ├── projectRoutes.js       # Public + admin project endpoints
│   │   └── webhookRoutes.js       # GitHub push event handler
│   └── .env                       # Secret config (not committed)
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Sidebar.jsx         # Fixed nav with semantic accent colors
        │   ├── Navbar.jsx          # Search + notification bell + admin link
        │   ├── KPICard.jsx         # Animated count-up + sparkline
        │   ├── ChartCard.jsx       # Bar, Line, Donut, Heatmap SVG charts
        │   ├── ProjectCard.jsx     # Per-card accent, working links
        │   ├── InsightsSection.jsx # Key findings + activity feed
        │   └── AboutSection.jsx    # GitHub profile + skill bars + timeline
        ├── pages/
        │   ├── Portfolio.jsx       # Root dashboard with section routing
        │   ├── AdminLogin.jsx      # 4-step auth: login → security Q → reset → done
        │   └── AdminDashboard.jsx  # Project management portal
        └── services/
            └── api.js              # All Axios API calls
```

---

## 🔑 Admin Access

| Route | Description |
|-------|-------------|
| `/` | Public analytics dashboard |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Protected project management panel |

**Forgot Password flow:**
1. Click "Forgot password?" on the sign-in page
2. Answer the security question
3. Enter your email + new password
4. Done — redirects back to sign-in

---

## 🌐 Deployment

- **Frontend:** Deploy `/frontend` to [Vercel](https://vercel.com) — set `VITE_API_URL` in Vercel environment variables
- **Backend:** Deploy `/backend` to [Render](https://render.com) or [Railway](https://railway.app) — set all `.env` variables in the platform dashboard
- **Webhooks:** Point your GitHub repo webhook to `https://your-backend.com/api/webhook`

---

## 📄 License

MIT © [Harshit Shakya](https://github.com/Harsh-sh7)

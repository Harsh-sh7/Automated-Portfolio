# Full-Stack Automated Developer Portfolio

A modern, automated developer portfolio that syncs your GitHub repositories directly into a stunning, GitHub dark-mode themed UI.

## Features

- **Automated GitHub Webhooks:** Automatically imports a project into the database when you push a new repository.
- **AI-Powered Summarization:** Uses Google Gemini AI to analyze your repository `README.md`, extract tech stacks, and infer concise feature bullet points.
- **Email Approval Flow:** Sends automated emails via Resend so you can securely Approve or Discard projects straight from your inbox with beautiful HTML templates.
- **Secure Admin Dashboard:** JWT-authenticated React portal allowing you to securely view added projects, manually import existing GitHub repos via API, and edit project metadata.
- **GitHub Aesthetics:** Pixel-perfect recreation of the GitHub dark theme including identical font families, color palettes (`#0d1117`), and interactive components.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **External APIs:** Google Gemini AI, GitHub REST API, Resend SMTP
- **Security:** Helmet, Morgan, JSONWebToken, BcryptJS

## Setup Instructions

### 1. Environment Variables
Configure your `.env` file in the `backend/` folder:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

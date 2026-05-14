# 🚀 CareerPilot AI — AI-Powered Learning Roadmap Generator

A full-stack web application that generates personalized career learning roadmaps using Google's Gemini AI. Features include interactive snake-style roadmap visualization, task tracking with study heatmaps, AI mentor chat, community sharing, and portfolio building.

## ✨ Features

- **AI Roadmap Generation** — Personalized learning paths powered by Gemini 2.0 Flash
- **Snake-Style Roadmap** — Interactive, perfectly-connected phase visualization
- **Task Tracking** — Mark tasks complete with study heatmap analytics
- **AI Mentor Chat** — Get real-time career advice from an AI mentor
- **Community Hub** — Share and discover public roadmaps
- **Portfolio Builder** — Track skills and showcase achievements
- **Todo Manager** — Organize daily learning tasks

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Google Gemini 2.0 Flash |
| Auth | JWT (JSON Web Tokens) |

## 📦 Project Structure

```
AI-Roadmap-Generator/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Gemini AI service
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth & Toast providers
│   │   └── pages/       # Page components
│   └── vite.config.js
├── package.json         # Root deployment scripts
└── .gitignore
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### Setup

```bash
# Clone the repo
git clone https://github.com/naveenhp33/AI-Roadmap-Generator.git
cd AI-Roadmap-Generator

# Install backend dependencies
cd backend && npm install

# Create .env file in backend/
# Add: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY

# Install frontend dependencies
cd ../frontend && npm install

# Run both servers
cd ../backend && node index.js    # Terminal 1 (port 5000)
cd ../frontend && npm run dev     # Terminal 2 (port 5173)
```

### Environment Variables (backend/.env)
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

## 🌐 Deployment (Render)

This project is configured for single-service deployment on **Render**:

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Build Command:** `npm run render-build`
   - **Start Command:** `npm start`
   - **Root Directory:** (leave empty)
4. Add environment variables:
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A secure random string
   - `GEMINI_API_KEY` — Your Google Gemini API key
   - `NODE_ENV` — `production`
5. Deploy!

## 📸 Screenshots

### Roadmap Snake Layout
The roadmap uses a perfectly-aligned 3-column snake pattern with smooth U-turn connectors.

### Phase Details
Each phase contains weekly goals, task tracking, suggested resources, and interview preparation.

## 👨‍💻 Author

**Naveen** — [GitHub](https://github.com/naveenhp33)

## 📄 License

ISC

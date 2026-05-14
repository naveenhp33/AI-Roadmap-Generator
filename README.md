# CareerPilot AI

A full-stack AI-powered web application that helps users generate personalized career learning roadmaps using Google's Gemini API.

## Tech Stack

- **Frontend**: React.js, Vanilla CSS, Axios, React Router DOM, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API (@google/genai)
- **Authentication**: JWT & bcrypt

## Features

- User Authentication (Register, Login, JWT Protected Routes)
- Dark Mode / Light Mode toggle
- Generate personalized learning roadmaps based on goals, skills, and availability
- Track roadmap progress (check off completed tasks)
- AI Mentor Chat for 24/7 career advice and debugging
- Dashboard to manage all saved roadmaps

## Project Structure

- `/frontend`: React Frontend
- `/backend`: Express & Node Backend

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder with the following contents:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the backend server: `npm run dev` (or `node index.js`)

### 2. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open the provided localhost URL in your browser.

## Deployment Notes

To deploy to production:
1. Ensure your MongoDB cluster allows remote connections.
2. Provide all environment variables to your deployment provider (e.g. Render, Heroku).
3. Build the frontend (`npm run build`) and serve the static files from the backend, or host the frontend on a platform like Vercel/Netlify.

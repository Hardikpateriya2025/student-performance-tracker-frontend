# Student Performance Tracker — Frontend

A React dashboard for tracking student performance, with real-time analytics charts, machine learning predictions, and a GenAI-powered tutor chatbot.

Live app: https://student-performance-tracker-fronten.vercel.app

Note: this app talks to a backend hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-60 seconds while the server wakes up.

## Features

- Authentication: Register and log in with role selection (admin / teacher / student)
- Dashboard: Live charts for course performance, class pass rates, and individual student score trends, plus a searchable student averages table
- AI Predictions: Each student's dashboard view shows a machine-learning-predicted next score and an at-risk flag, powered by the backend's trained models
- AI Tutor: A chat interface to ask natural-language questions about any student's performance, answered by an LLM grounded in that student's real data
- Manage Data: Forms to add courses, student profiles, and grades directly from the browser
- Role-based UI: Navigation and permissions adapt based on whether the logged-in user is an admin, teacher, or student

## Tech Stack

- Framework: React 18 + Vite
- Styling: Tailwind CSS v4
- Charts: Recharts
- Icons: lucide-react
- Routing: React Router
- HTTP client: Axios
- Deployment: Vercel

## Project Structure

src/
- api/ : Axios API client and endpoint functions, grouped by domain
- components/ : Shared UI components (Navbar)
- context/ : Auth context/provider for global login state
- pages/ : Route-level pages (Login, Register, Dashboard, Manage, Tutor)
- App.jsx : Route definitions and route protection
- main.jsx : App entrypoint

## Running Locally

1. Install dependencies:
   npm install

2. Create a .env.local file:
   VITE_API_URL=http://localhost:8000/api/v1

3. Run the dev server:
   npm run dev

4. Visit http://localhost:5173

Note: this frontend expects the backend API to be running (see the backend repo's README for setup instructions).

## Deployment Notes

This app is configured for Vercel with a vercel.json rewrite rule that routes all paths to index.html, which is required for React Router's client-side routing to work correctly on page refresh or direct navigation to a route.

The VITE_API_URL environment variable must be set in Vercel's project settings to point at the live backend URL.

## Related Repository

Backend: https://github.com/Hardikpateriya2025/student-performance-tracker-backend

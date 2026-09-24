# NutriCloud — AI-Powered Personal Diet Planner

A cloud-backed personal diet planning application built with React, FastAPI, Firebase Authentication, and Firestore.

## Features

- Firebase Authentication
- Personalized user profile
- Rule-based meal plan generation
- BMR, TDEE and macronutrient calculation
- Firestore cloud storage for profiles, plans and intake
- Daily nutrition tracking
- Dashboard with nutrition progress
- Saved meal plans
- Responsive modern UI

## Technology Stack

- React + Vite
- JavaScript
- FastAPI
- Python
- Firebase Authentication
- Firebase Firestore
- React Router
- Lucide React

## Architecture

User ? React Frontend ? Firebase Authentication / Firestore
                         ?
                    FastAPI Backend
                         ?
              Nutrition & Meal Planning

## Firestore Structure

users/{uid}/profile/profile
users/{uid}/plans/{planId}
users/{uid}/intake/{date}

## Local Setup

Frontend:
cd frontend
npm install
npm run dev

Backend:
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

## Firebase Configuration

Create frontend/.env with the Firebase web configuration values.

Do not commit .env or private credentials to GitHub.

## Current Implementation

- React/Vite frontend
- Firebase Authentication
- Firestore database
- FastAPI backend
- Rule-based meal planning
- Nutrition calculations
- Daily intake tracking
- Cloud-backed dashboard
- Firestore security rules
- Local demo mode

## Future Scope

- Advanced AI/LLM meal generation
- Food substitutions
- Shopping-list generation
- Cost-aware meal planning
- Nutrition trend analysis
- Notifications
- Cloud Run deployment
- Firebase Hosting deployment
- Mobile application
- ESP32 smart-scale integration
- CI/CD pipeline

## Project Purpose

This project demonstrates practical concepts of Cloud Computing, Firebase, NoSQL databases, authentication, REST APIs, React, Python backend development, cloud security, and data persistence.

This is an educational/general-wellness project and is not intended for medical or clinical use.

## License

For academic and portfolio use.

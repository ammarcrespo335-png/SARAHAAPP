Saraha App

An anonymous messaging platform with OTP-based email confirmation. Backend built with Node.js + Express + MongoDB and a minimal Angular frontend for demonstration.

Quick Overview

Backend: Node.js + Express + MongoDB (Mongoose)

Frontend: Angular

Goal: Allow users to receive anonymous messages while protecting accounts using OTP verification and anti-abuse measures (rate limiting + temporary bans).

Features

User signup with email confirmation (OTP)

Temporary ban after multiple failed OTP attempts

Send anonymous messages to other users

View & delete inbox messages

Security features: validation, sanitization, rate limiting

Tech Stack

Node.js / Express

MongoDB (Mongoose)

JWT Authentication

Angular Frontend

Requirements

Node.js v16+

MongoDB (local or Atlas)

npm or yarn

Environment Variables

Create a .env file inside the backend folder:

PORT=3000
MONGO_URI=mongodb://localhost:27017/saraha
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_api_key_here

Install & Run
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
ng serve

API Endpoints (Examples)
Auth

Signup → POST /auth/signup

{ "email": "user@example.com", "password": "yourPassword" }


Confirm Email → POST /auth/confirm-email

{ "email": "user@example.com", "otp": "123456" }

Messages

Send Message → POST /messages/send

Get Inbox → GET /messages (JWT required)

Delete Message → DELETE /messages/:id (JWT required)
## Project structure 
saraha-app/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ app.js
│  ├─ package.json
│  └─ .env.example
├─ frontend/
│  └─ angular/ (Angular app)
└─ README.md
## Author 
Ammar Crespo
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/5d52d58c-fccd-4c2a-9255-64b97f27236b" />
<img width="1919" height="759" alt="image" src="https://github.com/user-attachments/assets/802567ff-6374-454a-bdda-a19899ff1083" />


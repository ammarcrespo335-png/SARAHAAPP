📩 Saraha App

An anonymous messaging platform with OTP-based email confirmation.
Backend built with Node.js + Express + MongoDB and a minimal Angular frontend for demonstration.








📑 Table of Contents

Quick Overview

Features

Tech Stack

Requirements

Environment Variables

Install & Run

API Endpoints

Project Structure

Screenshots

Contributing

License

Author

⚡ Quick Overview

Backend: Node.js + Express + MongoDB (Mongoose)
Frontend: Angular
Goal: Allow users to receive anonymous messages while protecting accounts using OTP verification and anti-abuse measures (rate limiting + temporary bans).

🚀 Features

User signup with email confirmation (OTP)

Temporary ban after multiple failed OTP attempts

Send anonymous messages to other users

View & delete inbox messages

Security features: validation, sanitization, rate limiting

🛠 Tech Stack

Node.js / Express

MongoDB (Mongoose)

JWT Authentication

Angular Frontend

📦 Requirements

Node.js v16+

MongoDB (local or Atlas)

npm or yarn

🔑 Environment Variables

Create a .env file inside the backend folder:

PORT=3000
MONGO_URI=mongodb://localhost:27017/saraha
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_api_key_here

⚙️ Install & Run
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
ng serve

📡 API Endpoints (Examples)
🔐 Auth

Signup → POST /auth/signup

{ "email": "user@example.com", "password": "yourPassword" }


Confirm Email → POST /auth/confirm-email

{ "email": "user@example.com", "otp": "123456" }

💌 Messages

Send Message → POST /messages/send
Get Inbox → GET /messages (JWT required)
Delete Message → DELETE /messages/:id (JWT required)

📂 Project Structure
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

📸 Screenshots
<img width="1919" height="967" alt="Screenshot 2025-10-03 165117" src="https://github.com/user-attachments/assets/77042f5c-7d36-4fbc-9b62-295cbbfa1571" />
<img width="1919" height="759" alt="Screenshot 2025-10-03 165305" src="https://github.com/user-attachments/assets/39426035-7b8e-4993-89f2-3073670bfa9a" />




🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

📜 License

This project is licensed under the MIT License
.

👤 Author

Ammar Crespo


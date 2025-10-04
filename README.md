
📌 Saraha App



📖 Overview

Saraha App is a simple web application inspired by the original Saraha platform.
Users can register, login, send anonymous messages, and view messages received in their accounts.


🗂 Table of Contents

Features

Tech Stack

Requirements

Environment Variables

Installation & Run

API Endpoints

Project Structure

Screenshots

Future Improvements

License


🚀 Features

✅ User Registration & Authentication (JWT).

✅ Send anonymous messages.

✅ View messages in your account.

✅ Secure password hashing with bcryptjs.


🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

Auth: JWT (JSON Web Token)



---

📋 Requirements

Node.js (>= 18.x)

MongoDB (Local or Atlas)


🔑 Environment Variables

Create a .env file in the root folder:

PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret


⚙️ Installation & Run

# Clone repo
git clone https://github.com/ammarcrespo335-png/SARAHAAPP.git

# Go to project folder
cd SARAHAAPP

# Install dependencies
npm install

# Start server
npm start


📡 API Endpoints

🔐 Authentication

POST /auth/register   -> Register new user
POST /auth/login      -> Login and get JWT token

💬 Messages

POST /messages/:userId  -> Send anonymous message to user
GET /messages/my        -> Get my received messages


📂 Project Structure

SARAHAAPP
├── config/            # Database & server configs
├── controllers/       # Route logic
├── middlewares/       # Auth & error handling
├── models/            # Mongoose schemas
├── routes/            # API routes
├── utils/             # Helper functions
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js


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


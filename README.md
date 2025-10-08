📌 Saraha App

📖 Overview

Saraha App is a simple backend web application inspired by the original Saraha platform.
It allows users to register, log in, send anonymous messages, and view messages received in their accounts.

Built using Node.js, Express, and MongoDB, this project demonstrates authentication, authorization, validation, and secure data handling.

🗂 Table of Contents

Features

Tech Stack

Requirements

Environment Variables

Installation & Run

API Endpoints

Validation

Postman Collection

Project Structure

Screenshots

Future Improvements

License

Author

🚀 Features

✅ User Registration & Authentication (JWT)
✅ Send anonymous messages to registered users
✅ View received messages securely
✅ Secure password hashing with bcryptjs
✅ Input validation using express-validator
✅ Postman collection for easy API testing

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ORM)

Authentication: JWT (JSON Web Token)

Validation: express-validator

Encryption: bcryptjs

📋 Requirements

Node.js (>= 18.x)

MongoDB (Local or Atlas)

🔑 Environment Variables

Create a .env file in the root directory with the following:

PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key

⚙️ Installation & Run
# Clone the repository
git clone https://github.com/ammarcrespo335-png/SARAHAAPP.git

# Navigate into the project folder
cd SARAHAAPP

# Install dependencies
npm install

# Run the server
npm start


Server will start on http://localhost:3000

📡 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and receive a JWT token
💬 Messages
Method	Endpoint	Description
POST	/messages/:userId	Send an anonymous message to a user
GET	/messages/my	Get all received messages for the logged-in user
✅ Validation

All request bodies are validated using express-validator to ensure input safety.
Examples:

Email must be valid format.

Password must be at least 6 characters.

Message content cannot be empty.

If validation fails, the API returns:

{
  "errors": [
    { "msg": "Invalid email " }
  ]
}

📫 Postman Collection

A ready-to-use Postman collection is included for testing all endpoints.
Just import the file:

SARAHAAPP.postman_collection.json


and start sending requests instantly.

📂 Project Structure
SARAHAAPP/
├── config/            # Database & server configurations
├── controllers/       # Logic for each route
├── middlewares/       # Auth, validation, and error handling
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── utils/             # Helper functions
├── .env               # Environment variables
├── package.json
├── README.md
└── server.js

📸 Screenshots
<img width="1919" height="967" alt="Register API" src="https://github.com/user-attachments/assets/77042f5c-7d36-4fbc-9b62-295cbbfa1571" /> <img width="1919" height="759" alt="Messages API" src="https://github.com/user-attachments/assets/39426035-7b8e-4993-89f2-3073670bfa9a" />
🔮 Future Improvements

Add message pagination

Add rate limiting (security enhancement)

Implement unit/integration tests (Jest + Supertest)

Deploy on Render or Vercel with public demo link

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

📜 License

This project is licensed under the MIT License.

👤 Author

Ammar Crespo
GitHub: [@ammarcrespo335-png](https://github.com/ammarcrespo335-png)

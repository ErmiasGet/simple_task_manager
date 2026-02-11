# Simple Task Manager CRUD | MERN Stack

A simple **Task Manager** application that demonstrates a full CRUD workflow using the **MERN stack** (MongoDB, Express, React, Node.js).  
Users can create tasks, view all tasks, update task status, and delete tasks. This project is perfect for learning **API interactions** and **frontend-backend integration**.

---

## 🔹 Features

- **Create Tasks** (POST)
- **Read Tasks** (GET)
- **Update Tasks** (PUT) – toggle completion status
- **Delete Tasks** (DELETE)
- **RESTful API** with Express
- **MongoDB Database** for storing tasks
- **Axios** for API requests
- **React Frontend** with state management

---

## 🛠 Tech Stack

| Frontend | Backend | Database | HTTP Requests |
|----------|---------|----------|---------------|
| React.js | Node.js / Express.js | MongoDB | Axios |

---

## 📁 Folder Structure

task-crud/
├── backend/
│ ├── server.js
│ ├── models/
│ │ └── Task.js
│ └── .env
└── frontend/
├── src/
│ ├── services/
│ │ └── api.js
│ └── App.js
└── package.json

yaml
Copy code

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/task-manager-crud.git
cd task-manager-crud
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file:

ini
Copy code
MONGO_URI=your_mongodb_connection_string
PORT=5000
Start the server:

bash
Copy code
node server.js
The backend runs on http://localhost:5000.

3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
The frontend runs on http://localhost:3000 and connects to the backend automatically.

🔹 API Endpoints
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update a task by ID
DELETE	/api/tasks/:id	Delete a task by ID

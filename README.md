# 🚀 SkillBridge 🤝

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

> _A modern peer-to-peer learning platform for students_

---

<p align="center">
  <img src="./screenshots/animated-demo.gif" alt="SkillBridge Demo" width="700"/>
</p>

---

## ✨ Features

- 🔐 **Google OAuth Authentication**
- 💬 **Real-time Messaging & File Sharing**
- 📋 **Request Management & Categories**
- 👤 **User Profiles, Ratings & Reviews**
- 📁 **File Uploads (images, docs, pdfs)**
- 🌙 **Dark Mode & Modern UI**
- 🔔 **Real-time Notifications**
- 📊 **Data Visualization & Analytics**
- 🛡️ **Secure, Fast, and Scalable**

---

## 🛠️ Tech Stack

| Frontend                        | Backend                        |
|---------------------------------|--------------------------------|
| ⚛️ React 18 + TypeScript + Vite | 🌐 Node.js + Express.js        |
| 🎨 Tailwind CSS + shadcn/ui     | 🍃 MongoDB + Mongoose          |
| 🔌 Socket.io (Real-time)        | 🔒 JWT Auth + Google OAuth     |
| 📦 Axios, React Query           | 🗂️ Multer (File Uploads)       |
| 🧩 Modern UI Libraries          | 🛡️ Helmet, CORS, Rate Limiting |

---

## 📦 Project Structure

```text
SkillFull/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   ├── netlify.toml
│   ├── vercel.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── scripts/
│   ├── uploads/
│   └── package.json
└── README.md
```

---

## 🚦 Quick Start

```bash
# Backend
cd backend
npm install
cp env.example .env
npm run seed
npm run dev

# Frontend
cd frontend
npm install
cp env.example .env
npm run dev
```

---

## 🔧 API Endpoints

| Endpoint                          | Method   | Description                  |
|-----------------------------------|----------|------------------------------|
| `/api/auth/google`                | POST     | Google OAuth login           |
| `/api/auth/profile`               | GET      | Get user profile             |
| `/api/auth/verify`                | GET      | Verify JWT token             |
| `/api/requests`                   | GET/POST | Get or create requests       |
| `/api/requests/:id`               | GET      | Get single request           |
| `/api/requests/:id/accept`        | POST     | Accept request               |
| `/api/requests/:id/complete`      | POST     | Complete request             |
| `/api/requests/categories/all`    | GET      | Get categories               |
| `/api/messages/request/:id`       | GET      | Get messages for a request   |
| `/api/messages`                   | POST     | Send a message               |
| `/api/messages/request/:id/read`  | PUT      | Mark messages as read        |
| `/api/messages/upload`            | POST     | Upload a file                |
| `/api/ai-chatbot`                 | POST     | AI Chatbot (Gemini API)      |
| `/api/health`                     | GET      | Backend health check         |

---

## 🎨 Screenshots & Demo

<p align="center">
  <img src="./screenshots/chat-demo.gif" alt="Chat Demo" width="400"/>
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="400"/>
</p>

---

## 👨‍💻 Developer Experience

- ⚡ Hot reload for both frontend and backend
- 🛡️ TypeScript everywhere for safety
- 🧹 Prettier, ESLint, and Husky for code quality
- ✨ Modern, animated UI with glassmorphism and gradients
- 🔧 Easy environment config via `.env` files
- 🏗️ Modular, scalable folder structure

---

## 📖 Documentation

- [API Reference](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Features](#-features)

---

## ❤️ Contributing

We welcome contributions! Please open issues and pull requests.

---

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Made with <span style="color:#e11d48;">&#10084;&#65039;</span> by the SkillBridge Team — 2024</b>
</p>
# 🚀 SkillBridge 🤝

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

> _A modern peer-to-peer learning platform for students_

---

<p align="center">
  <img src="./screenshots/animated-demo.gif" alt="SkillBridge Demo" width="700"/>
</p>

---

## ✨ Features

- 🔐 **Google OAuth Authentication**
- 💬 **Real-time Messaging & File Sharing**
- 📋 **Request Management & Categories**
- 👤 **User Profiles, Ratings & Reviews**
- 📁 **File Uploads (images, docs, pdfs)**
- 🌙 **Dark Mode & Modern UI**
- 🔔 **Real-time Notifications**
- 📊 **Data Visualization & Analytics**
- 🛡️ **Secure, Fast, and Scalable**

---

## 🛠️ Tech Stack

| Frontend                        | Backend                        |
|---------------------------------|--------------------------------|
| ⚛️ React 18 + TypeScript + Vite | 🌐 Node.js + Express.js        |
| 🎨 Tailwind CSS + shadcn/ui     | 🍃 MongoDB + Mongoose          |
| 🔌 Socket.io (Real-time)        | 🔒 JWT Auth + Google OAuth     |
| 📦 Axios, React Query           | 🗂️ Multer (File Uploads)       |
| 🧩 Modern UI Libraries          | 🛡️ Helmet, CORS, Rate Limiting |

---

## 📦 Project Structure

```text
SkillFull/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   ├── netlify.toml
│   ├── vercel.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── scripts/
│   ├── uploads/
│   └── package.json
└── README.md
```

---

## 🚦 Quick Start

```bash
# Backend
cd backend
npm install
cp env.example .env
npm run seed
npm run dev

# Frontend
cd frontend
npm install
cp env.example .env
npm run dev
```

---

## 🔧 API Endpoints

| Endpoint                          | Method   | Description                  |
|-----------------------------------|----------|------------------------------|
| `/api/auth/google`                | POST     | Google OAuth login           |
| `/api/auth/profile`               | GET      | Get user profile             |
| `/api/auth/verify`                | GET      | Verify JWT token             |
| `/api/requests`                   | GET/POST | Get or create requests       |
| `/api/requests/:id`               | GET      | Get single request           |
| `/api/requests/:id/accept`        | POST     | Accept request               |
| `/api/requests/:id/complete`      | POST     | Complete request             |
| `/api/requests/categories/all`    | GET      | Get categories               |
| `/api/messages/request/:id`       | GET      | Get messages for a request   |
| `/api/messages`                   | POST     | Send a message               |
| `/api/messages/request/:id/read`  | PUT      | Mark messages as read        |
| `/api/messages/upload`            | POST     | Upload a file                |
| `/api/ai-chatbot`                 | POST     | AI Chatbot (Gemini API)      |
| `/api/health`                     | GET      | Backend health check         |

---

## 🎨 Screenshots & Demo

<p align="center">
  <img src="./screenshots/chat-demo.gif" alt="Chat Demo" width="400"/>
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="400"/>
</p>

---

## 👨‍💻 Developer Experience

- ⚡ Hot reload for both frontend and backend
- 🛡️ TypeScript everywhere for safety
- 🧹 Prettier, ESLint, and Husky for code quality
- ✨ Modern, animated UI with glassmorphism and gradients
- 🔧 Easy environment config via `.env` files
- 🏗️ Modular, scalable folder structure

---

## 📖 Documentation

- [API Reference](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Features](#-features)

---

## ❤️ Contributing

We welcome contributions! Please open issues and pull requests.

---

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Made with <span style="color:#e11d48;">&#10084;&#65039;</span> by the SkillBridge Team — 2024</b>
</p>

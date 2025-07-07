# SkillWave Connect

A peer-to-peer learning platform where students can help each other with academic and skill-based requests.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google
- **Real-time Messaging** - Socket.io powered chat
- **Request Management** - Create, accept, and complete help requests
- **Category System** - Organized by subject areas
- **User Profiles** - Skills, ratings, and reviews
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Axios (HTTP client)
- Socket.io Client (Real-time)
- Tailwind CSS + shadcn/ui
- React Router DOM
- React Query

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (Real-time)
- JWT Authentication
- Google OAuth

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/skillwave
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:8000
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the frontend:
```bash
npm run dev
```

## 🎯 Usage

1. **Register/Login** - Use Google OAuth to create an account
2. **Create Requests** - Post help requests in various categories
3. **Browse Requests** - Find requests that match your skills
4. **Accept Requests** - Help other students
5. **Chat** - Real-time messaging with request participants
6. **Complete Requests** - Mark requests as finished

## 📁 Project Structure

```
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── pages/             # Route components
│   ├── services/          # API and socket services
│   └── utils/             # Helper functions
├── backend/               # Backend source
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── config/            # Database config
│   └── scripts/           # Database scripts
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get single request
- `POST /api/requests/:id/accept` - Accept request
- `POST /api/requests/:id/complete` - Complete request
- `GET /api/requests/categories/all` - Get categories

## 🚀 Deployment

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy automatically

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/skillwave
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:8000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

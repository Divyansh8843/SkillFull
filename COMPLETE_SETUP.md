# SkillWave Connect - Complete Setup Guide

## 🚀 Features Implemented

### ✅ **Core Features**

- **Google Authentication** - Secure login with Google OAuth
- **Protected Routes** - Pages secured behind authentication
- **Database Integration** - MySQL backend with comprehensive schema
- **Real-time Messaging** - Socket.io for instant communication
- **User Profiles & Ratings** - User management with rating system
- **Request Categories & Filtering** - Organized help requests
- **Email Notifications** - Automated email alerts

### ✅ **Frontend Features**

- **Enhanced Send Request Page** - Complete form with categories, skills, urgency, budget
- **Advanced Accept Request Page** - Filtering, messaging, request management
- **Real-time Chat** - Instant messaging between users
- **Responsive Design** - Works on all devices
- **Modern UI** - Beautiful shadcn/ui components

### ✅ **Backend Features**

- **REST API** - Complete CRUD operations
- **Socket.io Server** - Real-time communication
- **JWT Authentication** - Secure token-based auth
- **Email Service** - Nodemailer integration
- **Rate Limiting** - API protection
- **File Uploads** - Image and document support

## 🔧 Setup Instructions

### 1. **Frontend Setup** (Already Done ✅)

The frontend is already configured and running on http://localhost:8000

### 2. **Database Setup** (Required)

#### Install MySQL:

1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Install and start MySQL server
3. Create a database:
   ```sql
   CREATE DATABASE skillwave_db;
   ```

#### Run Database Schema:

1. Open MySQL Workbench or command line
2. Run the schema from: `database/schema.sql`
3. Run the seed data from: `database/seed.sql`

### 3. **Backend Configuration**

#### Environment Variables:

1. Copy the backend environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your settings:

   ```env
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=skillwave_db
   DB_PORT=3306

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Email (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Server
   PORT=3001
   FRONTEND_URL=http://localhost:8000
   ```

#### Start Backend Server:

```bash
cd backend
npm run dev
```

### 4. **Email Setup** (Optional)

#### Gmail Configuration:

1. Enable 2-factor authentication on your Gmail
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Use this app password in your `.env` file

## 🎯 How to Use

### **For Students (Requesting Help):**

1. Sign in with Google
2. Click "Send Request"
3. Fill out the detailed form:
   - Title and description
   - Select category
   - Add required skills
   - Set urgency level
   - Specify duration and location
   - Set budget (optional)
4. Submit and wait for helpers

### **For Helpers (Providing Help):**

1. Sign in with Google
2. Click "Accept Request"
3. Use filters to find relevant requests:
   - Search by keywords
   - Filter by category, urgency, location
4. Click "Accept Request" to help
5. Use "Message" to communicate

### **Communication:**

- Real-time messaging between users
- Email notifications for new messages
- Chat history saved for each request

### **Rating System:**

- Rate helpers after completion
- View user ratings and reviews
- Build reputation over time

## 🔧 Development Commands

### Frontend:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend:

```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

## 📁 Project Structure

```
skillwave-connect-glow-main/
├── src/                      # Frontend React app
│   ├── components/           # UI components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   ├── services/            # API and socket services
│   └── hooks/               # Custom hooks
├── backend/                 # Node.js/Express backend
│   ├── routes/              # API routes
│   ├── config/              # Database config
│   └── scripts/             # Database scripts
├── database/                # SQL files
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Sample data
└── public/                  # Static assets
```

## 🚀 Deployment

### Frontend (Vercel/Netlify):

1. Build the app: `npm run build`
2. Deploy the `dist` folder
3. Update environment variables

### Backend (Railway/Heroku):

1. Create a production database
2. Set environment variables
3. Deploy the `backend` folder

### Database (PlanetScale/Railway):

1. Create a production MySQL database
2. Run schema and seed files
3. Update connection string in backend

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Validates all user inputs
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Controlled cross-origin access
- **Helmet.js** - Security headers

## 📧 Email Notifications

Users receive emails for:

- New help requests in their skills area
- Request acceptance notifications
- New messages received
- Request completion confirmations
- Review notifications

## 🎨 UI Components

- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icons
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Coming soon

## 🔄 Real-time Features

- **Instant Messaging** - Socket.io powered chat
- **Live Notifications** - Real-time alerts
- **Online Status** - See who's online
- **Typing Indicators** - Chat enhancements
- **Message Delivery** - Confirmation system

Your SkillWave Connect platform is now fully featured and ready for production! 🎉

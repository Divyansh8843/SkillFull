# SkillFull

A peer-to-peer learning platform where students can help each other with academic and skill-based requests through real-time communication and file sharing.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google
- **Real-time Messaging** - Socket.io powered chat with file sharing
- **Request Management** - Create, accept, and complete help requests
- **Category System** - Organized by subject areas and skills
- **User Profiles** - Skills, ratings, and reviews
- **File Upload Support** - Share images, documents, and files
- **Responsive Design** - Modern UI with shadcn/ui components
- **Real-time Notifications** - Instant updates for new messages
- **Backend Health Monitoring** - Live status checking
- **Dark Mode Support** - Theme switching with next-themes
- **Form Validation** - Comprehensive form handling with Zod
- **Data Visualization** - Charts and analytics with Recharts


## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool with SWC)
- **Axios** (HTTP client)
- **Socket.io Client** (Real-time communication)
- **Tailwind CSS** + **shadcn/ui** (Modern UI components)
- **React Router DOM** (Routing)
- **React Query** (Data fetching and caching)
- **React Hook Form** + **Zod** (Form handling and validation)
- **Lucide React** (Icons)
- **Sonner** (Toast notifications)
- **Radix UI** (Accessible UI primitives)
  - Accordion, Alert Dialog, Avatar, Checkbox
  - Collapsible, Context Menu, Dialog, Dropdown Menu
  - Hover Card, Label, Menubar, Navigation Menu
  - Popover, Progress, Radio Group, Scroll Area
  - Select, Separator, Slider, Switch, Tabs
  - Toast, Toggle, Tooltip
- **Date-fns** (Date manipulation)
- **Embla Carousel** (Carousel components)
- **Input OTP** (One-time password inputs)
- **React Day Picker** (Date picker)
- **React Resizable Panels** (Resizable layouts)
- **Recharts** (Data visualization)
- **Vaul** (Drawer components)
- **Class Variance Authority** (Component variants)
- **CLSX** (Conditional classes)
- **CMDK** (Command palette)
- **Tailwind Merge** (Class merging)
- **Tailwind CSS Animate** (Animations)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Socket.io** (Real-time communication)
- **JWT Authentication**
- **Google OAuth**
- **Multer** (File uploads)
- **Helmet** (Security)
- **Rate Limiting** (API protection)
- **Compression** (Performance)
- **BCrypt.js** (Password hashing)
- **CORS** (Cross-origin resource sharing)
- **Express Validator** (Input validation)
- **Dotenv** (Environment variables)

### Development Tools
- **TypeScript** (Type safety)
- **ESLint** (Code linting)
- **PostCSS** (CSS processing)
- **Autoprefixer** (CSS vendor prefixes)
- **Nodemon** (Development server)
- **Lovable Tagger** (Component tagging)

### Deployment & Hosting
- **Netlify** (Frontend hosting)
- **Vercel** (Frontend hosting)
- **Heroku** (Backend hosting)
- **Railway** (Backend hosting)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth Client ID

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/skillfull
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:8000
PORT=3001
NODE_ENV=development
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
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the frontend:
```bash
npm run dev
```

## 🎯 Usage

1. **Register/Login** - Use Google OAuth to create an account
2. **Create Requests** - Post help requests in various categories with file attachments
3. **Browse Requests** - Find requests that match your skills
4. **Accept Requests** - Help other students
5. **Real-time Chat** - Communicate with request participants
6. **File Sharing** - Share documents, images, and files
7. **Complete Requests** - Mark requests as finished
8. **Notifications** - Get real-time updates for new messages
9. **Data Analytics** - View charts and statistics
10. **Theme Switching** - Toggle between light and dark modes

## 📁 Project Structure

```
SkillFull/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route components
│   │   ├── services/        # API and socket services
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   │   ├── favicon.ico      # App icon
│   │   ├── robots.txt       # SEO robots file
│   │   └── placeholder.svg  # Placeholder image
│   ├── netlify.toml         # Netlify deployment config
│   ├── vercel.json          # Vercel deployment config
│   ├── static.json          # Static hosting config
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── vite.config.ts       # Vite build configuration
│   ├── eslint.config.js     # ESLint configuration
│   ├── postcss.config.js    # PostCSS configuration
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js + Express backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── config/              # Database configuration
│   ├── scripts/             # Database scripts
│   ├── uploads/             # File upload directory
│   └── package.json         # Backend dependencies
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

### Messages
- `GET /api/messages/:requestId` - Get messages for a request
- `POST /api/messages` - Send a message
- `POST /api/messages/file` - Send a file message

### Health Check
- `GET /health` - Backend health status
- `GET /api/health` - API health status

## 🚀 Deployment

### Backend Deployment
The backend includes multiple deployment scripts:
```bash
# Development deployment
npm run deploy:dev

# Production deployment
npm run deploy:prod
```

### Frontend Deployment
The frontend includes build scripts for different environments:
```bash
# Development build
npm run build:dev

# Production build
npm run build:prod
```

### Environment Files
- `env.development` - Development environment variables
- `env.production` - Production environment variables

### Deployment Platforms
- **Netlify**: Configured with `netlify.toml`
- **Vercel**: Configured with `vercel.json`
- **Static Hosting**: Configured with `static.json`

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/skillfull
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:8000
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API protection against abuse
- **CORS Configuration** - Cross-origin resource sharing
- **JWT Authentication** - Secure token-based auth
- **File Upload Validation** - Secure file handling
- **Input Validation** - Express-validator middleware
- **BCrypt Password Hashing** - Secure password storage
- **HTTPS Enforcement** - Secure transport layer

## 📱 Real-time Features

- **Socket.io Integration** - Real-time messaging
- **File Sharing** - Real-time file uploads and downloads
- **Notifications** - Instant message notifications
- **Room-based Chat** - Organized conversations per request
- **Connection Management** - User presence tracking
- **Real-time Status Updates** - Live request status changes

## 🎨 UI/UX Features

- **Dark Mode Support** - Theme switching with next-themes
- **Responsive Design** - Mobile-first approach
- **Accessible Components** - Radix UI primitives
- **Smooth Animations** - Tailwind CSS animations
- **Toast Notifications** - User feedback system
- **Loading States** - Better user experience
- **Form Validation** - Real-time validation feedback
- **Data Visualization** - Charts and analytics

## 🛠️ Development Features

- **TypeScript** - Type safety and better DX
- **ESLint** - Code quality and consistency
- **Hot Reload** - Fast development with Vite
- **Path Aliases** - Clean import paths (@/components)
- **Component Tagging** - Development tooling
- **PostCSS Processing** - Advanced CSS features
- **SWC Compilation** - Fast TypeScript compilation

## 📊 Performance Features

- **Code Splitting** - Lazy loading with React Router
- **Image Optimization** - Optimized static assets
- **Compression** - Gzip compression for responses
- **Caching** - React Query caching strategy
- **Bundle Optimization** - Vite build optimization
- **Tree Shaking** - Unused code elimination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow ESLint rules for code consistency
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the health endpoints: `/health` and `/api/health`
- Review the backend logs for detailed error information
- Ensure all environment variables are properly configured
- Check deployment platform documentation
- Review the API documentation above

## 🔗 Related Links

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Socket.io Documentation](https://socket.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

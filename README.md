<!--
  SkillBridge README - HTML Animated Version
  To view this README with full animation, open it in a browser or use a Markdown viewer that supports HTML.
-->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillBridge - Peerr Learning Platform</title>
  <style>
    body {
      font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      color: #22223b;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      animation: fadeInBg 2s;
    }
    @keyframes fadeInBg {
      from { background: #22223b; }
      to { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); }
    }
    .container {
      max-width: 900px;
      margin: 40px auto;
      background: rgba(255,255,255,0.98);
      border-radius: 24px;
      box-shadow: 0 8px 48px 0 rgba(99,102,241,0.12);
      padding: 40px 36px 60px 36px;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 1.2s cubic-bezier(.4,1.3,.6,1);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h1, h2, h3 {
      font-family: 'Fira Mono', 'Consolas', monospace;
      color: #6366f1;
      margin-top: 0;
    }
    h1 {
      font-size: 2.8rem;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 0.5em;
    }
    h1 .emoji {
      font-size: 2.2em;
      animation: bounce 1.2s infinite alternate;
    }
    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-10px); }
    }
    .subtitle {
      font-size: 1.3rem;
      color: #4f46e5;
      margin-bottom: 2em;
      font-weight: 500;
      letter-spacing: 1px;
      animation: fadeIn 2s 0.5s both;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .section {
      margin-bottom: 2.5em;
      animation: fadeIn 1.2s;
    }
    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2em 2em;
      margin-top: 1em;
    }
    .feature {
      background: linear-gradient(90deg, #e0e7ff 0%, #f1f5ff 100%);
      border-left: 4px solid #6366f1;
      border-radius: 12px;
      padding: 1em 1.2em;
      font-size: 1.08em;
      margin-bottom: 0.5em;
      box-shadow: 0 2px 8px rgba(99,102,241,0.06);
      transition: transform 0.2s;
    }
    .feature:hover {
      transform: scale(1.03) translateX(6px);
      background: linear-gradient(90deg, #a5b4fc 0%, #e0e7ff 100%);
    }
    .code-block {
      background: #232946;
      color: #e0e7ff;
      border-radius: 10px;
      padding: 1.2em 1.5em;
      font-size: 1.05em;
      margin: 1em 0;
      overflow-x: auto;
      font-family: 'Fira Mono', 'Consolas', monospace;
      box-shadow: 0 2px 12px rgba(99,102,241,0.10);
      transition: background 0.3s;
    }
    .project-structure {
      background: #f1f5ff;
      border-radius: 10px;
      padding: 1.2em 1.5em;
      font-size: 1.05em;
      margin: 1em 0;
      font-family: 'Fira Mono', 'Consolas', monospace;
      box-shadow: 0 2px 12px rgba(99,102,241,0.10);
      transition: background 0.3s;
    }
    .api-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      font-size: 1em;
    }
    .api-table th, .api-table td {
      border: 1px solid #a5b4fc;
      padding: 0.7em 1em;
      text-align: left;
    }
    .api-table th {
      background: #6366f1;
      color: #fff;
    }
    .api-table tr:nth-child(even) {
      background: #f1f5ff;
    }
    .footer {
      text-align: center;
      color: #6366f1;
      margin-top: 3em;
      font-size: 1.1em;
      letter-spacing: 1px;
      opacity: 0.8;
      animation: fadeIn 2s 1.5s both;
    }
    @media (max-width: 700px) {
      .container { padding: 18px 4vw; }
      .features { grid-template-columns: 1fr; }
      .project-structure, .code-block { padding: 1em 0.5em; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1><span class="emoji">🚀</span> SkillBridge <span class="emoji">🤝</span></h1>
    <div class="subtitle">A modern peer-to-peer learning platform for students, built with React, Node.js, and MongoDB.</div>

    <div class="section">
      <h2>✨ Features</h2>
      <div class="features">
        <div class="feature">🔐 Google OAuth Authentication</div>
        <div class="feature">💬 Real-time Messaging & File Sharing</div>
        <div class="feature">📋 Request Management & Categories</div>
        <div class="feature">👤 User Profiles, Ratings & Reviews</div>
        <div class="feature">📁 File Uploads (images, docs, pdfs)</div>
        <div class="feature">🌙 Dark Mode & Modern UI</div>
        <div class="feature">🔔 Real-time Notifications</div>
        <div class="feature">📊 Data Visualization & Analytics</div>
        <div class="feature">🛡️ Secure, Fast, and Scalable</div>
      </div>
    </div>

    <div class="section">
      <h2>🛠️ Tech Stack</h2>
      <div class="features">
        <div class="feature">⚛️ React 18 + TypeScript + Vite</div>
        <div class="feature">🎨 Tailwind CSS + shadcn/ui</div>
        <div class="feature">🔌 Socket.io (Real-time)</div>
        <div class="feature">🌐 Express.js + Node.js</div>
        <div class="feature">🍃 MongoDB + Mongoose</div>
        <div class="feature">🔒 JWT Auth + Google OAuth</div>
        <div class="feature">🗂️ Multer (File Uploads)</div>
        <div class="feature">☁️ Netlify/Vercel/Heroku/Railway</div>
      </div>
    </div>

    <div class="section">
      <h2>📁 Project Structure</h2>
      <pre class="project-structure">SkillFull/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Route components
│   │   ├── services/         # API and socket services
│   │   ├── lib/              # Helper functions
│   │   └── utils/            # Utility files
│   ├── public/               # Static assets
│   ├── netlify.toml          # Netlify config
│   ├── vercel.json           # Vercel config
│   ├── tailwind.config.ts    # Tailwind CSS config
│   ├── vite.config.ts        # Vite config
│   └── package.json          # Frontend dependencies
├── backend/                  # Node.js + Express backend
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── config/               # Database config
│   ├── scripts/              # DB scripts
│   ├── uploads/              # File uploads
│   └── package.json          # Backend dependencies
└── README.md
</pre>
    </div>

    <div class="section">
      <h2>🚦 Quick Start</h2>
      <div class="code-block">
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
      </div>
    </div>

    <div class="section">
      <h2>🔧 API Endpoints</h2>
      <table class="api-table">
        <tr><th>Endpoint</th><th>Method</th><th>Description</th></tr>
        <tr><td>/api/auth/google</td><td>POST</td><td>Google OAuth login</td></tr>
        <tr><td>/api/auth/profile</td><td>GET</td><td>Get user profile</td></tr>
        <tr><td>/api/auth/verify</td><td>GET</td><td>Verify JWT token</td></tr>
        <tr><td>/api/requests</td><td>GET/POST</td><td>Get or create requests</td></tr>
        <tr><td>/api/requests/:id</td><td>GET</td><td>Get single request</td></tr>
        <tr><td>/api/requests/:id/accept</td><td>POST</td><td>Accept request</td></tr>
        <tr><td>/api/requests/:id/complete</td><td>POST</td><td>Complete request</td></tr>
        <tr><td>/api/requests/categories/all</td><td>GET</td><td>Get categories</td></tr>
        <tr><td>/api/messages/request/:id</td><td>GET</td><td>Get messages for a request</td></tr>
        <tr><td>/api/messages</td><td>POST</td><td>Send a message</td></tr>
        <tr><td>/api/messages/request/:id/read</td><td>PUT</td><td>Mark messages as read</td></tr>
        <tr><td>/api/messages/upload</td><td>POST</td><td>Upload a file</td></tr>
        <tr><td>/api/ai-chatbot</td><td>POST</td><td>AI Chatbot (Gemini API)</td></tr>
        <tr><td>/api/health</td><td>GET</td><td>Backend health check</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>🎨 Screenshots & Demo</h2>
      <p><i>Add your screenshots or a Loom/Youtube demo link here for extra wow! ✨</i></p>
    </div>

    <div class="section">
      <h2>👨‍💻 Developer Experience</h2>
      <ul>
        <li>Hot reload for both frontend and backend</li>
        <li>TypeScript everywhere for safety</li>
        <li>Prettier, ESLint, and Husky for code quality</li>
        <li>Modern, animated UI with glassmorphism and gradients</li>
        <li>Easy environment config via <code>.env</code> files</li>
        <li>Modular, scalable folder structure</li>
      </ul>
    </div>

    <div class="footer">
      <span>Made with <span style="color:#e11d48;">&#10084;&#65039;</span> by the SkillBridge Team &mdash; 2024</span>
    </div>
  </div>
</body>
</html>

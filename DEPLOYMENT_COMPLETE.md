# 🚀 SkillWave Connect - Complete Deployment Guide

## Quick Start Deployment (Recommended)

### Method 1: Railway + Vercel (Easiest)

#### Step 1: Database Setup (Supabase - Free)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database and copy the connection string
4. In the SQL Editor, paste the contents of `database/schema-postgresql.sql`
5. Run the schema to create tables
6. Paste the contents of `database/seed-postgresql.sql` to add categories

#### Step 2: Backend Deployment (Railway - Free)

1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your SkillWave repository
4. Railway will detect it's a Node.js project and deploy automatically
5. Add environment variables in the Railway dashboard:
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_random_secret_key
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Your backend will be available at: `https://your-app.railway.app`

#### Step 3: Frontend Deployment (Vercel - Free)

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "New Project" and import your SkillWave repository
3. Vercel will detect it's a Vite React project
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy! Your frontend will be available at: `https://your-app.vercel.app`

#### Step 4: Connect Frontend to Backend

1. Update the API URL in your deployed frontend
2. Test the connection by creating and viewing requests

---

## Method 2: All-in-One Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- A VPS or cloud server (DigitalOcean, Linode, AWS EC2)

### Steps

1. Clone your repository to the server
2. Copy environment templates:
   ```bash
   cp backend/.env.production.template backend/.env.production
   cp .env.production.template .env.production
   ```
3. Fill in the environment variables
4. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```
5. Your app will be available at your server's IP address

---

## Method 3: Individual Platform Deployment

### Database Options

- **Supabase** (PostgreSQL, Free tier): Easiest, includes auth
- **PlanetScale** (MySQL, Free tier): Serverless, easy scaling
- **Railway PostgreSQL**: One-click database
- **AWS RDS**: Production-grade, requires setup

### Backend Options

- **Railway**: Easiest Node.js deployment
- **Render**: Free tier, good for APIs
- **Heroku alternatives**: Cyclic, Fly.io
- **AWS Elastic Beanstalk**: More complex but powerful

### Frontend Options

- **Vercel**: Best for React, automatic deployments
- **Netlify**: Easy drag-and-drop, good CI/CD
- **AWS Amplify**: Full-stack, more complex
- **GitHub Pages**: Free for static sites

---

## Production Checklist

### Security

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate all user inputs
- [ ] Enable authentication

### Performance

- [ ] Set up database indexes
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Enable caching

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up analytics (Google Analytics)
- [ ] Enable logging
- [ ] Set up backup strategy

### Domain & DNS

- [ ] Purchase domain name
- [ ] Configure DNS records
- [ ] Set up SSL certificate
- [ ] Configure redirects (www, etc.)

---

## Estimated Costs

### Free Tier (Recommended for testing)

- **Database**: Supabase (Free) - 500MB, 2 concurrent connections
- **Backend**: Railway (Free) - $5 credit, then $0.000463/GB-hour
- **Frontend**: Vercel (Free) - 100GB bandwidth, unlimited static deployments
- **Domain**: $10-15/year (optional)
- **Total**: $10-15/year (just domain)

### Production Tier

- **Database**: Supabase Pro ($25/month) or AWS RDS ($20-50/month)
- **Backend**: Railway ($5-20/month) or AWS EC2 ($10-30/month)
- **Frontend**: Vercel Pro ($20/month) or AWS CloudFront ($5-15/month)
- **Domain**: $10-15/year
- **Total**: $50-100/month

---

## Next Steps

1. **Choose your deployment method** (Railway + Vercel recommended)
2. **Set up accounts** on chosen platforms
3. **Follow the step-by-step guide** above
4. **Test the deployed application**
5. **Configure custom domain** (optional)
6. **Set up monitoring and backups**

## Need Help?

- Check the troubleshooting section below
- Review platform-specific documentation
- Test locally first before deploying
- Use the health check endpoints to verify deployments

# Deployment Guide for EventPulse OS

This guide will help you deploy EventPulse OS to various platforms. The application consists of a Node.js/Express backend with a React frontend built with Vite.

## Prerequisites

- Node.js (v18 or higher)
- npm or bun
- Google Gemini API key (for AI features)
- Git

## Environment Variables

Create a `.env` file with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
```

## Deployment Options

### 1. Vercel (Recommended for Frontend + Serverless)

Vercel is excellent for React applications and can handle the Express backend.

#### Setup Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` configuration**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.ts",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/$1"
       },
       {
         "src": "/",
         "dest": "/dist/index.html"
       }
     ]
   }
   ```

3. **Update package.json for Vercel**
   ```json
   {
     "scripts": {
       "vercel-build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
     }
   }
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Add `GEMINI_API_KEY` as an environment variable

### 2. Railway (Full Stack Deployment)

Railway is great for deploying both frontend and backend together.

#### Setup Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize and Deploy**
   ```bash
   railway init
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set GEMINI_API_KEY=your_key
   railway variables set PORT=3000
   railway variables set NODE_ENV=production
   ```

5. **Expose the port**
   - In Railway dashboard, set port to `3000`

### 3. Render (Free Tier Available)

Render offers a free tier for web services.

#### Setup Steps:

1. **Create `render.yaml` configuration**
   ```yaml
   services:
     - type: web
       name: eventpulse-os
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: GEMINI_API_KEY
           sync: false
         - key: PORT
           value: 3000
         - key: NODE_ENV
           value: production
   ```

2. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push
   ```

3. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Render will detect the configuration automatically

### 4. DigitalOcean App Platform

#### Setup Steps:

1. **Create `do-app.yaml` configuration**
   ```yaml
   name: eventpulse-os
   services:
     - name: eventpulse-web
       github:
         repo: your-username/EventPulse-AI-Smart-Event-Experience
         branch: master
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: GEMINI_API_KEY
           value: your_key
         - key: PORT
           value: "3000"
         - key: NODE_ENV
           value: production
   ```

2. **Deploy via DigitalOcean Dashboard**
   - Go to DigitalOcean App Platform
   - Create new app
   - Connect GitHub repository
   - Use the configuration file

### 5. Traditional VPS/Cloud (AWS, GCP, Azure)

For more control, you can deploy to traditional cloud providers.

#### Setup Steps:

1. **Build the application**
   ```bash
   npm install
   npm run build
   ```

2. **Transfer files to server**
   ```bash
   # Using SCP
   scp -r dist user@your-server:/var/www/eventpulse
   scp -r node_modules user@your-server:/var/www/eventpulse
   scp package.json user@your-server:/var/www/eventpulse
   ```

3. **On the server**
   ```bash
   # Install dependencies if needed
   cd /var/www/eventpulse
   npm install --production

   # Set up environment
   echo "GEMINI_API_KEY=your_key" > .env
   echo "PORT=3000" >> .env
   echo "NODE_ENV=production" >> .env

   # Start the application
   npm start
   ```

4. **Set up process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start dist/server.cjs --name eventpulse
   pm2 startup
   pm2 save
   ```

5. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Local Production Build

To test the production build locally:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The application will be available at `http://localhost:3000`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment mode (development/production) |

## Troubleshooting

### Build Issues

If you encounter build errors:

```bash
# Clean build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### API Key Issues

If AI features don't work:

1. Verify your GEMINI_API_KEY is set correctly
2. Check the API key has proper permissions
3. Test the API key locally first

### Port Issues

If the port is already in use:

```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill the process or change PORT in .env
```

## Monitoring and Logs

### Vercel
- Dashboard: Automatic deployment logs
- CLI: `vercel logs`

### Railway
- Dashboard: Real-time logs
- CLI: `railway logs`

### Render
- Dashboard: Deployment and runtime logs

### Traditional VPS
- PM2: `pm2 logs eventpulse`
- System logs: `/var/log/syslog`

## Performance Optimization

1. **Enable CDN** for static assets
2. **Use compression** (gzip/brotli)
3. **Implement caching** headers
4. **Monitor performance** with tools like Lighthouse

## Security Best Practices

1. Never commit `.env` files
2. Use strong API keys
3. Enable HTTPS in production
4. Implement rate limiting
5. Keep dependencies updated
6. Use environment-specific configurations

## Cost Comparison

| Platform | Free Tier | Starting Cost | Best For |
|----------|-----------|---------------|----------|
| Vercel | Yes | $0 | Frontend-focused apps |
| Railway | $5 free credit | $5/month | Full-stack apps |
| Render | Free tier available | $7/month | Simple deployment |
| DigitalOcean | No | $5/month | Full control |
| AWS/GCP | Free tier available | Variable | Enterprise scale |

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Test locally first
- Check environment variables

Choose the deployment option that best fits your needs and budget!
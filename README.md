# TV Channels Player

A web-based TV channels player that fetches channels from the IPTV M3U playlist and allows you to filter by country and watch streams.

## Tech Stack

- **Backend**: Java Spring Boot 3.2.0
- **Frontend**: React 18 with Vite
- **Data Source**: https://iptv-org.github.io/iptv/index.m3u

## Features

- 📺 Browse thousands of TV channels from around the world
- 🌍 Filter channels by country
- 🔍 Search channels by name
- ▶️ Play channels directly in the browser
- 🎨 Modern, responsive dark theme UI

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Node.js 18 or higher
- npm or yarn

## Project Structure

```
D:/All Channels/
├── backend/                 # Java Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tvplayer/
│   │       │   ├── TvPlayerApplication.java
│   │       │   ├── controller/
│   │       │   │   └── ChannelController.java
│   │       │   ├── model/
│   │       │   │   └── Channel.java
│   │       │   └── service/
│   │       │       └── M3UParserService.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/               # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ChannelList.jsx
    │   │   └── VideoPlayer.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── components/
    │       ├── ChannelList.css
    │       └── VideoPlayer.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd "D:/All Channels/backend"
```

2. Build and run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd "D:/All Channels/frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. The app will load channels from the IPTV M3U playlist
3. Use the country filter dropdown to filter channels by country
4. Use the search box to find specific channels
5. Click on any channel to start watching

## API Endpoints

- `GET /api/channels` - Get all channels
- `GET /api/channels/countries` - Get list of available countries
- `GET /api/channels/filter?country={country}&category={category}` - Filter channels

## Notes

- Some channels may not work due to geo-restrictions or offline streams
- The video player uses HTML5 video element which supports HLS and MP4 streams
- For better HLS support, consider integrating hls.js in the future
- The initial load may take a few seconds as it fetches the entire M3U playlist

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/tv-player-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Deployment

### Frontend Deployment on Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variable for backend API URL:
   - Go to Vercel dashboard
   - Navigate to your project settings
   - Add environment variable: `VITE_API_URL` with your backend URL (e.g., `https://your-backend-url.com`)

4. Redeploy after setting the environment variable

### Backend Deployment Options

Since Vercel is optimized for static sites and serverless functions, the Java Spring Boot backend needs to be deployed elsewhere:

**Option 1: Render.com**
- Create a free account on Render.com
- Connect your GitHub repository
- Create a new Web Service
- Select "Docker" or use the build command: `mvn clean package`
- Set start command: `java -jar target/tv-player-backend-1.0.0.jar`
- Deploy

**Option 2: Railway.app**
- Similar process to Render
- Supports Java deployments

**Option 3: Heroku**
- Create a `Procfile` in the backend directory:
```
web: java -jar target/tv-player-backend-1.0.0.jar
```
- Deploy using Heroku CLI or GitHub integration

**Option 4: AWS/Azure/GCP**
- Deploy as a container or EC2 instance
- Use your preferred cloud provider

After deploying the backend, update the `VITE_API_URL` environment variable in your Vercel project to point to your deployed backend URL.

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080  # For local development
VITE_API_URL=https://your-backend-url.com  # For production
```

### Backend (application.properties)
```
server.port=8080
```

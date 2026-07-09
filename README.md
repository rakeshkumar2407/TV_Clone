# TV Channels Player

A web-based TV channels player that fetches channels from the IPTV M3U playlist and allows you to filter by country and watch streams.

## Tech Stack

- **Backend**: Node.js/Express (for Vercel deployment) or Java Spring Boot 3.2.0 (for local development)
- **Frontend**: React 18 with Vite
- **Data Source**: https://iptv-org.github.io/iptv/index.m3u

## Features

- 📺 Browse thousands of TV channels from around the world
- 🌍 Filter channels by country
- 🔍 Search channels by name
- ▶️ Play channels directly in the browser
- 🎨 Modern, responsive dark theme UI
- ☁️ Deployed on Vercel

## Prerequisites

- Node.js 18 or higher
- npm or yarn

For local development with Java backend:
- Java 17 or higher
- Maven 3.6 or higher


## Local Development

### Option 1: Using Node.js Backend (Recommended for Vercel deployment)

1. **Start the Node.js backend:**
   ```bash
   cd api
   npm install
   npm start
   ```
   The backend will start on `http://localhost:3001`

2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

3. **Configure API URL:**
   Create a `.env` file in the `frontend` directory:
   ```
   VITE_API_URL=http://localhost:3001
   ```

### Option 2: Using Java Spring Boot Backend

1. **Start the Java backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

3. **Configure API URL:**
   Create a `.env` file in the `frontend` directory:
   ```
   VITE_API_URL=http://localhost:8080
   ```

## Vercel Deployment

The project is configured to deploy on Vercel with both frontend and backend:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Environment Variables:**
   - No additional environment variables needed for Vercel deployment
   - The frontend uses relative URLs when `VITE_API_URL` is empty

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


server.port=8080
```

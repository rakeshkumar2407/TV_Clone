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

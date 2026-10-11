import React, { useState, useEffect } from 'react';
import ChannelList from './components/ChannelList';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelsQueue, setChannelsQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/countries`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCountries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    // if selecting from outside queue, reset queue index
    const idx = channelsQueue.findIndex(c => c.url === channel.url);
    if (idx !== -1) setQueueIndex(idx);
    else setQueueIndex(-1);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    };

  const handleStartQueue = (queue) => {
    if (!Array.isArray(queue) || queue.length === 0) return;
    setChannelsQueue(queue);
    setQueueIndex(0);
    setSelectedChannel(queue[0]);
  };

  const handleNext = () => {
    if (!channelsQueue || channelsQueue.length === 0) return;
    const next = Math.min(queueIndex + 1, channelsQueue.length - 1);
    setQueueIndex(next);
    setSelectedChannel(channelsQueue[next]);
  };

  const handlePrev = () => {
    if (!channelsQueue || channelsQueue.length === 0) return;
    const prev = Math.max(queueIndex - 1, 0);
    setQueueIndex(prev);
    setSelectedChannel(channelsQueue[prev]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <button 
          className="mobile-toggle" 
          onClick={() => setSidebarOpen(v => !v)} 
          aria-label="Toggle channels"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
            <polyline points="17 2 12 7 7 2"></polyline>
          </svg>
          TV Channels Player
        </h1>
      </header>
      <div className="app-content">
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ChannelList
            selectedCountry={selectedCountry}
            selectedChannel={selectedChannel}
            onCountryChange={handleCountryChange}
            countries={countries}
            onChannelSelect={handleChannelSelect}
            loadingCountries={loadingCountries}
            onPlayAll={handleStartQueue}
          />
        </div>
        <div className="main-content">
          <VideoPlayer channel={selectedChannel} onNext={handleNext} onPrev={handlePrev} queueIndex={queueIndex} queueSize={channelsQueue.length} />
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './ChannelList.css';

function ChannelList({ selectedCountry, onCountryChange, countries, onChannelSelect, loadingCountries, selectedChannel, onPlayAll }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChannels();
  }, [selectedCountry]);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const url = selectedCountry
        ? `/api/channels/filter?country=${encodeURIComponent(selectedCountry)}&size=10000`
        : '/api/channels?size=10000';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChannels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching channels:', error);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = Array.isArray(channels) ? channels.filter(channel =>
    channel.name && channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Ensure the currently selected channel remains visible even if it doesn't match the search
  const displayedChannels = (() => {
    const list = Array.isArray(filteredChannels) ? [...filteredChannels] : [];
    try {
      if (selectedChannel && selectedChannel.name) {
        const exists = list.some(ch => (ch.url && selectedChannel.url && ch.url === selectedChannel.url) || (ch.name === selectedChannel.name));
        if (!exists) {
          list.unshift(selectedChannel);
        }
      }
    } catch (e) {
      // ignore
    }
    return list;
  })();

  const getFullCountryName = (country) => {
    if (!country) return '';
    // If country looks like 2-letter code, try Intl.DisplayNames
    try {
      if (typeof country === 'string' && country.length === 2) {
        if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
          const dn = new Intl.DisplayNames(['en'], { type: 'region' });
          return dn.of(country) || country;
        }
      }
    } catch (e) {
      // fall through
    }
    return country;
  };

  return (
    <div className="channel-list">
      <div style={{display:'flex', gap:8, justifyContent:'flex-end', padding:'0 12px'}}>
        <button className="play-all-btn" onClick={() => { if (displayedChannels.length) { if (typeof onPlayAll === 'function') onPlayAll(displayedChannels); } }}>Play All</button>
      </div>
      <div className="filter-section">
        <h2>Filter by Country</h2>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="country-select"
          disabled={loadingCountries}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {getFullCountryName(country)}
            </option>
          ))}
        </select>
        {loadingCountries && <div className="loading-countries">Loading countries...</div>}
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search channels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="channels-count">
        {loading ? 'Loading...' : `${filteredChannels.length} channels`}
      </div>

      <div className="channels-container">
        {loading ? (
          <div className="loading">Loading channels...</div>
        ) : (
          displayedChannels.map((channel, index) => (
            <div
              key={(channel.url || channel.name) + index}
              className={`channel-item ${selectedChannel && selectedChannel.url === channel.url ? 'selected' : ''}`}
              onClick={() => onChannelSelect(channel)}
            >
              {channel.logo && (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="channel-logo"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div className="channel-info">
                <div className="channel-name">{channel.name}</div>
                <div className="channel-meta">
                  <span className="channel-country">{getFullCountryName(channel.country)}</span>
                  {channel.category && (
                    <span className="channel-category">{channel.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChannelList;

import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';
import { getFullCountryName } from '../utils/countryMapping';

function VideoPlayer({ channel, onNext, onPrev, queueIndex, queueSize }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(-1); // -1 = auto

  useEffect(() => {
    const video = videoRef.current;
    
    // Aggressive cleanup of previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.stopLoad();
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);

    if (video && channel) {
      // Stop any existing video completely
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src');
      video.load();

      const url = channel.url;

      // Check if HLS is supported
      if (Hls.isSupported() && url.includes('.m3u8')) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(url);
        hls.attachMedia(video);

        const onManifest = () => {
          const lvls = (hls.levels || []).map((l, i) => ({
            index: i,
            height: l.height,
            bitrate: l.bitrate
          }));
          setLevels(lvls);
          setSelectedLevel(-1);
          video.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        };
        hls.on(Hls.Events.MANIFEST_PARSED, onManifest);

        const onLevelSwitched = (_event, data) => {
          if (typeof data?.level === 'number') setSelectedLevel(data.level);
        };
        hls.on(Hls.Events.LEVEL_SWITCHED, onLevelSwitched);

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error, cannot recover:', data);
                hls.destroy();
                setError('Stream not available. Please try another channel.');
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl') && url.includes('.m3u8')) {
        // store handlers so they can be removed on cleanup
        hls._onManifestParsed = onManifest;
        hls._onLevelSwitched = onLevelSwitched;
        // Native HLS support (Safari)
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        });
        video.addEventListener('error', () => {
          setError('Stream not available. Please try another channel.');
        });
      } else {
        // Direct MP4 or other format
        video.src = url;
        video.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
        video.addEventListener('error', () => {
          setError('Stream not available. Please try another channel.');
        });
      }
    }

    // Aggressive cleanup on unmount or channel change
    return () => {
      if (hlsRef.current) {
        // remove listeners if present
        try {
          if (hlsRef.current._onManifestParsed) hlsRef.current.off(Hls.Events.MANIFEST_PARSED, hlsRef.current._onManifestParsed);
          if (hlsRef.current._onLevelSwitched) hlsRef.current.off(Hls.Events.LEVEL_SWITCHED, hlsRef.current._onLevelSwitched);
        } catch (e) {}
        hlsRef.current.stopLoad();
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [channel]);

  const handleQualityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setSelectedLevel(val);
    const hls = hlsRef.current;
    if (hls) {
      // -1 means automatic
      if (val === -1) {
        hls.currentLevel = -1;
      } else {
        hls.currentLevel = val;
      }
    }
  };

  if (!channel) {
    return (
      <div className="video-player-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📺</div>
          <h2>Select a channel to start watching</h2>
          <p>Choose from the channel list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player">
      <div className="player-header">
            <div className="channel-header-info">
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="header-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.style.setProperty('display', 'flex');
              }}
            />
          ) : null}
          <div
            className="header-logo-fallback"
            style={{ display: channel.logo ? 'none' : 'flex' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
          </div>
            <div>
            <h2 className="header-channel-name">{channel.name}</h2>
              <div className="header-channel-meta">
              <span className="header-country">{getFullCountryName(channel.country)}</span>
              {channel.category && (
                <span className="header-category">{channel.category}</span>
              )}
                {levels && levels.length > 0 && (() => {
                  const highest = levels.reduce((best, cur) => {
                    const bh = best.height || 0;
                    const ch = cur.height || 0;
                    return ch > bh ? cur : best;
                  }, levels[0]);
                  return (
                    <>
                      <select className="quality-select" value={selectedLevel} onChange={handleQualityChange}>
                        <option value={-1}>Auto</option>
                        <option key="highest" value={highest.index}>Highest (4K if available)</option>
                        {levels.map(l => {
                          let label = 'Unknown';
                          if (l.height && l.height > 0) label = `${l.height}p`;
                          else if (l.bitrate && l.bitrate > 0) label = `${Math.round(l.bitrate/1000)} kbps`;
                          else label = `Level ${l.index}`;
                          return <option key={l.index} value={l.index}>{label}</option>;
                        })}
                      </select>
                    </>
                  );
                })()}
            </div>
            <div className="player-controls">
              <button className="ctrl-btn" onClick={() => onPrev && onPrev()} aria-label="Previous">⏮</button>
              <button className="ctrl-btn" onClick={() => onNext && onNext()} aria-label="Next">⏭</button>
              {typeof queueIndex === 'number' && typeof queueSize === 'number' && queueSize > 0 && (
                <div className="queue-indicator">{Math.max(0, queueIndex + 1)}/{queueSize}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="video-container">
        {error ? (
          <div className="video-error">
            <div className="error-icon">⚠️</div>
            <h3>Stream Error</h3>
            <p>{error}</p>
            <p className="error-hint">Some channels may be geo-blocked or offline. Try another channel.</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="video-element"
            controls
            key={channel.url}
          />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;

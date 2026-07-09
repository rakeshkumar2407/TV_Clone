const axios = require('axios');

const M3U_URL = 'https://iptv-org.github.io/iptv/index.m3u';
let cachedChannels = [];
let cacheInitialized = false;

// Parse M3U content
function parseM3U(m3uContent) {
  const channels = [];
  const lines = m3uContent.split('\n');
  
  let currentName = null;
  let currentLogo = null;
  let currentCountry = null;
  let currentCategory = null;
  let currentLanguage = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('#EXTINF:')) {
      currentName = extractAttribute(trimmedLine, 'tvg-name');
      if (!currentName) {
        const commaIndex = trimmedLine.lastIndexOf(',');
        if (commaIndex !== -1) {
          currentName = trimmedLine.substring(commaIndex + 1).trim();
        }
      }
      currentLogo = extractAttribute(trimmedLine, 'tvg-logo');
      currentCountry = extractAttribute(trimmedLine, 'tvg-country');
      currentCategory = extractAttribute(trimmedLine, 'group-title');
      currentLanguage = extractAttribute(trimmedLine, 'tvg-language');
      
      // Extract country from tvg-id if not found
      if (!currentCountry) {
        const tvgId = extractAttribute(trimmedLine, 'tvg-id');
        if (tvgId) {
          const atIndex = tvgId.lastIndexOf('@');
          const idPart = atIndex !== -1 ? tvgId.substring(0, atIndex) : tvgId;
          const lastDotIndex = idPart.lastIndexOf('.');
          if (lastDotIndex !== -1) {
            currentCountry = idPart.substring(lastDotIndex + 1).toUpperCase();
          }
        }
      }
      
      // Try alternative country attribute names
      if (!currentCountry) {
        currentCountry = extractAttribute(trimmedLine, 'country');
      }
    } else if (trimmedLine.startsWith('http') && currentName) {
      const channel = {
        name: currentName,
        logo: currentLogo,
        url: trimmedLine,
        country: currentCountry || 'Unknown',
        category: currentCategory || 'General',
        language: currentLanguage || 'Unknown'
      };
      channels.push(channel);
      
      currentName = null;
      currentLogo = null;
      currentCountry = null;
      currentCategory = null;
      currentLanguage = null;
    }
  }

  console.log(`Parsed ${channels.length} channels`);
  return channels;
}

function extractAttribute(line, attributeName) {
  const pattern = `${attributeName}="`;
  const startIndex = line.indexOf(pattern);
  if (startIndex !== -1) {
    const start = startIndex + pattern.length;
    const endIndex = line.indexOf('"', start);
    if (endIndex !== -1) {
      return line.substring(start, endIndex);
    }
  }
  return null;
}

// Fetch and cache channels
async function fetchChannels() {
  if (cacheInitialized && cachedChannels.length > 0) {
    return cachedChannels;
  }

  try {
    const response = await axios.get(M3U_URL, { timeout: 60000 });
    cachedChannels = parseM3U(response.data);
    cacheInitialized = true;
    return cachedChannels;
  } catch (error) {
    console.error('Error fetching channels:', error.message);
    if (cacheInitialized && cachedChannels.length > 0) {
      return cachedChannels;
    }
    return [];
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const channels = await fetchChannels();
    const countries = [...new Set(channels.map(ch => ch.country))]
      .filter(c => c && c !== 'Unknown')
      .sort();
    
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

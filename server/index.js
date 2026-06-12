const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// In-memory store: shortCode -> originalUrl
const urlMap = new Map();

// Only allow requests from the React dev server
app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateShortCode() {
  return crypto.randomBytes(4).toString('base64url').slice(0, 6);
}

// POST /shorten — create a short URL
app.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required.' });
  }

  // Limit input length to guard against abuse
  if (url.length > 2048) {
    return res.status(400).json({ error: 'URL is too long (max 2048 characters).' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });
  }

  // Return existing short code if this URL was already shortened
  for (const [code, original] of urlMap.entries()) {
    if (original === url) {
      return res.json({ shortUrl: `${BASE_URL}/${code}` });
    }
  }

  // Generate a unique short code
  let shortCode;
  let attempts = 0;
  do {
    shortCode = generateShortCode();
    attempts++;
    if (attempts > 100) {
      return res.status(500).json({ error: 'Could not generate a unique code. Try again.' });
    }
  } while (urlMap.has(shortCode));

  urlMap.set(shortCode, url);
  console.log(`Stored: ${shortCode} -> ${url}`);
  res.json({ shortUrl: `${BASE_URL}/${shortCode}` });
});

// GET /:shortCode — redirect to original URL
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  // Only allow alphanumeric and base64url characters
  if (!/^[A-Za-z0-9_-]{1,20}$/.test(shortCode)) {
    return res.status(400).json({ error: 'Invalid short code.' });
  }

  const originalUrl = urlMap.get(shortCode);
  if (!originalUrl) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  res.redirect(302, originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});

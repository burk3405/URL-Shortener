import { useState, useEffect } from 'react'

const SERVER_URL = 'http://localhost:3001'

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleShorten = async () => {
    setError('')
    setShortUrl('')
    setCopied(false)

    if (!inputUrl.trim()) {
      setError('Please enter a URL.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${SERVER_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setShortUrl(data.shortUrl)
        setCount((c) => c + 1)
      }
    } catch {
      setError('Could not connect to the server. Make sure it is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = shortUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleShorten()
  }

  const shortCode = shortUrl ? shortUrl.split('/').pop() : ''

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <div className="logo">
            <LinkIcon />
          </div>
          <div className="header-text">
            <h1>snip<span className="accent">.</span></h1>
            <p>URL shortener</p>
          </div>
          {count > 0 && (
            <div className="count-badge">
              {count} link{count !== 1 ? 's' : ''}
            </div>
          )}
          <button
            className="theme-btn"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle theme"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <div className="divider" />

        <div className="field">
          <label htmlFor="url-input" className="field-label">Long URL</label>
          <input
            id="url-input"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://..."
            className="url-input"
            aria-label="URL to shorten"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <button
          onClick={handleShorten}
          disabled={loading}
          className="shorten-btn"
        >
          {loading ? <span className="spinner" /> : '→ Shorten'}
        </button>

        <div className="feedback-zone">
          {error && <p className="error" role="alert">⚠ {error}</p>}
          <div
            className={`result${!shortUrl ? ' result--empty' : ''}`}
            aria-hidden={!shortUrl}
          >
            <div className="result-meta">
              <span className="result-label">Short link</span>
              <span className="result-code">{shortCode ? `/${shortCode}` : ''}</span>
            </div>
            <div className="result-row">
              <a
                href={shortUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="short-url"
                tabIndex={shortUrl ? 0 : -1}
              >
                {shortUrl}
              </a>
              <button
                onClick={shortUrl ? handleCopy : undefined}
                className={`copy-btn${copied ? ' copied' : ''}`}
                aria-label="Copy short URL"
                tabIndex={shortUrl ? 0 : -1}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">Built with React + Express</footer>
      <footer className="footer">Aaron Burkett © {new Date().getFullYear()}</footer>
    </div>
  )
}

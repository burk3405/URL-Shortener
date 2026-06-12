# snip. — URL Shortener

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A minimal URL shortener. Paste a long link, get a short one, share it anywhere.

---

## How it works

When you submit a URL, the backend generates a unique 6-character code and stores the mapping in memory. Visiting the short link sends an HTTP 302 redirect straight to the original destination — the server never proxies or hosts the target site.

```
https://very-long-url.com/path/to/something?with=params
                         ↓
              http://localhost:3001/AbC123
```

---

## Project structure

```
URL-Shortener/
├── client/                 React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── App.css
└── server/                 Node.js + Express backend
    ├── package.json
    └── index.js
```

---

## Getting started

Two terminals are needed — one per process.

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

The server starts at `http://localhost:3001`. `nodemon` will restart it automatically when you edit `index.js`.

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Vite starts at `http://localhost:5174`. Open that in your browser and the app is ready.

---

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/shorten` | Create a short URL |
| `GET` | `/:shortCode` | Redirect to the original URL |

**Create a short URL**

```http
POST /shorten
Content-Type: application/json

{ "url": "https://google.com/" }
```

```json
{ "shortUrl": "http://localhost:3001/AbC123" }
```

**Redirect**

```http
GET /AbC123
→ HTTP 302 Location: https://google.com/
```

---

## Roadmap

- [ ] Persistent storage (SQLite or PostgreSQL)
- [ ] Custom aliases — `short.ly/myresume`
- [ ] Click analytics (count, timestamp, referrer)
- [ ] Link expiration by date or click count
- [ ] QR code generation
- [ ] User accounts and link management
- [ ] Rate limiting
- [ ] Docker support

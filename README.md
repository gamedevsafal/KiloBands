# Music Store Backend

This is a simple Node.js and Express backend for a school project.

## Folder Structure

```
.
├── public
│   └── music
│       ├── song1.mp3
│       ├── song2.mp3
│       └── song3.mp3
├── package.json
└── server.js
```

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

   The server will be running on `http://localhost:4000`.

## How to Test the APIs

- **Get all songs:**

  Open your browser or a tool like Postman and go to:
  `http://localhost:4000/api/songs`

- **Get a single song by ID:**

  `http://localhost:4000/api/songs/1`

- **Download a song:**

  `http://localhost:4000/api/download/song1.mp3`

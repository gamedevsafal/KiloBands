
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

let db;

connectDB().then(database => {
  db = database;
  // Seed the database if it's empty
  const songsCollection = db.collection('songs');
  songsCollection.countDocuments().then(count => {
    if (count === 0) {
      console.log('Seeding database with initial data...');
      songsCollection.insertMany([
        { id: 1, title: 'Song 1', artist: 'Artist 1', filename: 'song1.mp3', price: 0.99 },
        { id: 2, title: 'Song 2', artist: 'Artist 2', filename: 'song2.mp3', price: 0.99 },
        { id: 3, title: 'Song 3', artist: 'Artist 3', filename: 'song3.mp3', price: 0.99 },
      ]);
    }
  });
});

app.get('/api/songs', async (req, res) => {
  const songs = await db.collection('songs').find({}).toArray();
  res.json(songs);
});

app.get('/api/songs/:id', async (req, res) => {
  const song = await db.collection('songs').findOne({ id: parseInt(req.params.id) });
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  res.json(song);
});

app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'public', 'music', filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});

app.get('/api/music/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'public', 'music', filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found' });
        }
    });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

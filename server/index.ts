import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

// Serve static files from client dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
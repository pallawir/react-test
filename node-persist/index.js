const express = require('express');
const cors = require('cors');
const storage = require('node-persist');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

(async () => {
  await storage.init({
    dir: 'storage', // specify the storage directory
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: true,
    forgiveParseErrors: true, // Forgive parse errors to prevent crashes
    ttl: false,
  });

  app.get('/stats', async (req, res) => {
    try {
      const stats = await storage.getItem('stats') || { totalScore: 0, totalRuns: 0 };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
  
  app.post('/stats', async (req, res) => {
    try {
      const { totalScore, totalRuns } = req.body;
      const stats = { totalScore, totalRuns };
      await storage.setItem('stats', stats);
      res.json(stats);
    } catch (error) {
      console.error('Error updating stats:', error);
      res.status(500).json({ error: 'Failed to update stats' });
    }
  });
  

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();

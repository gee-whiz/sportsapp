require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const playerRoutes = require('./src/routes/playerRoutes');
const connectDB = require('./src/config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/v1/players', playerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    mongoose.connection.close().catch(() => {});
    process.exit(1);
  });

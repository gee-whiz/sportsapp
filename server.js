require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const playerRoutes = require('./src/routes/playerRoutes');
const connectDB = require('./src/config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openapiSpec = yaml.load(
  fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use('/v1/players', playerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// Keep a single connection promise to reuse across serverless invocations.
const dbReady = connectDB();

// Only start listening when run directly (e.g., `node server.js`). In Vercel,
// the handler below is used instead.
if (require.main === module) {
  dbReady
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
}

// Vercel serverless entrypoint: wait for DB once, then delegate to Express.
module.exports = async (req, res) => {
  await dbReady;
  return app(req, res);
};

module.exports.app = app;

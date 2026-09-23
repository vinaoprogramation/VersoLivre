const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173'
  ]
}

const userRoutes = require('../src/routes/userRoutes');
const healthRoutes = require('../src/routes/healthRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());


app.use('/health', healthRoutes);
app.use('/user', userRoutes);


module.exports = app;
const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const DBConnect = require('./config/connectionDB');
const authRouter = require('./routes/authRoutes');

env.config();

const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;

const app = express();

DBConnect();

app.use((req, res, next) => {
    console.log(`Requested API: ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use(errorHandler);


app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
});

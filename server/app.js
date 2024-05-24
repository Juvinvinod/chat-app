const express = require('express');
const cors = require("cors");

const userRouter = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', userRouter);

module.exports = app;
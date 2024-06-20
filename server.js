const express = require('express');
const app = express();
app.use(express.json());
const PORT = 5000;
const connectDB = require('./db');
connectDB();
app.listen(PORT, () => console.log('Server connected to port ${PORT}'));

process.on("UnhandledRejection", err => {
    console.log('An error occurred: ${err.message}')
    server.close(() => process.exit(1))
})

app.use("/api/auth", require("./Auth/Route"))
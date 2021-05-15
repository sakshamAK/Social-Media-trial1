const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");

//connected database from db.js
connectDB();
app.use(express.json({ extended: false }));

//sendibg basic request to check server activity
app.get('/', (req, res) => {
    res.send("API running...");
});

//Define routes
app.use('/api/user', require('./Routes/api/User'));
app.use('/api/profile', require('./Routes/api/Profile'));
app.use('/api/auth', require('./Routes/api/Auth'));
app.use('/api/posts', require('./Routes/api/Posts'));


app.listen(PORT, () => { console.log("Connecting to database...") });
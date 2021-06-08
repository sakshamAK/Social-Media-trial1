const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

//connected database from db.js
connectDB();
app.use(express.json({ extended: false }));

//sending basic request to check server activity
app.get('/', (req, res) => {
    res.json({age : '2'});
});

//Define routes
app.use('/api/user', require('./Routes/api/users'));
app.use('/api/profile', require('./Routes/api/Profile'));
app.use('/api/auth', require('./Routes/api/Auth'));
app.use('/api/posts', require('./Routes/api/Posts'));


app.listen(PORT, () => { console.log("Started on port", PORT) });
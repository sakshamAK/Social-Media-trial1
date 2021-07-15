const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

//connected database from db.js
connectDB();
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'x-auth-token');
    next();
});

//sending basic request to check server activity
app.get('/', (req, res) => {
    console.log("server active");
});

//Define routes
app.use('/api/user', require('./Routes/api/users'));
app.use('/api/profile', require('./Routes/api/Profile'));
app.use('/api/auth', require('./Routes/api/Auth'));
app.use('/api/posts', require('./Routes/api/Posts'));


app.listen(PORT, () => { console.log("Started on port", PORT) });
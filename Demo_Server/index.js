console.log("Hello world");
require('dotenv').config();

// Test if it works
console.log(process.env.PORT);
const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/twitter', (req, res) => {
    res.send('https://x.com/Kartik0192421')
})
app.get('/login', (req, res) => {
    res.send('<h1>Please login the account before login');
})
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})

console.log("Hello world");

const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/twitter', (req, res) => {
    res.send('https://x.com/Kartik0192421')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
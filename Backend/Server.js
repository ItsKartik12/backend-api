import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.listen(port, () => {
    console.log(`[🚀] Serve at http://localhost:${port}`);
});
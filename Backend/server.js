import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.send('Server is ready');
});

/**
 * @route   GET /api/jokes
 * @desc    Get a list of 5 programming jokes
 * @access  Public
 */
app.get('/api/jokes', (req, res) => { // Updated route to match api standard
    const jokes = [
        {
            id: 1,
            title: "Hardware vs Software",
            content: "What's the difference between hardware and software? Hardware wins arguments when dropped on your foot."
        },
        {
            id: 2,
            title: "The Clean Coder",
            content: "There are 10 types of people in the world: those who understand binary, and those who don't."
        },
        {
            id: 3,
            title: "The Perfect Query",
            content: "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'"
        },
        {
            id: 4,
            title: "Infinite Loop",
            content: "Why do programmers wear glasses? Because they can't C#."
        },
        {
            id: 5,
            title: "The Compiler Problem",
            content: "Why did the programmer quit their job? Because they didn't get arrays."
        }
    ];

    // Standardized JSON delivery with implicit status mapping
    res.status(200).json(jokes);
});

// Server initialization
app.listen(port, () => {
    console.log(`[🚀] Serve at http://localhost:${port}`);
});

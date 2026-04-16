const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Minimal API for Demo Storytelling

// Mandi Prices Endpoint
app.get('/api/prices', (req, res) => {
    // Return sample prices, focusing on Ramesh in U.P.
    const prices = [
        { crop: 'Wheat', mandi: 'Kanpur', price: 2300, unit: 'Quintal', date: new Date().toISOString() },
        { crop: 'Wheat', mandi: 'Lucknow', price: 2200, unit: 'Quintal', date: new Date().toISOString() },
        { crop: 'Rice', mandi: 'Varanasi', price: 3100, unit: 'Quintal', date: new Date().toISOString() }
    ];
    res.json(prices);
});

// Weather API Endpoint
app.get('/api/weather', (req, res) => {
    // For Kanpur demo
    const weather = {
        location: 'Kanpur',
        condition: 'Clear',
        temperature: 28,
        precipitationChance: 5, // 5% chance of rain
        advice: 'Favorable harvesting conditions.'
    };
    res.json(weather);
});

// Alerts endpoint
app.post('/api/alerts', (req, res) => {
    // A mock alert endpoint
    const { profit } = req.body;
    if (profit > 0) {
        res.json({ success: true, message: `Alert sent! Profitable trade confirmed (₹${profit}).` });
    } else {
        res.json({ success: true, message: "No alert sent. Not profitable." });
    }
});

// Starting server
app.listen(PORT, () => {
    console.log(`Farmer Mandi Dashboard running on http://localhost:${PORT}`);
});

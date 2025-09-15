const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Discord Bot Setup
let client = new Client({ intents: [GatewayIntentBits.Guilds] });

app.post('/api/set-token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    client.login(token)
        .then(() => res.json({ status: 'Bot logged in successfully!' }))
        .catch(err => res.status(500).json({ error: 'Failed to log in', details: err }));
});

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Connect to MongoDB
mongoose.connect('mongodb+srv://kaspergamevip:kaspergamevip@cluster0.kedtm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API route example
app.get('/api/status', (req, res) => {
    res.json({ status: 'Dashboard backend is running!' });
});

// API route to get bot status
app.get('/api/bot-status', (req, res) => {
    if (client.user) {
        res.json({ status: `Bot is online as ${client.user.tag}` });
    } else {
        res.json({ status: 'Bot is offline' });
    }
});

// Import and use moderation routes
const moderationRoutes = require('./routes/moderation')(client);
app.use('/api/moderation', moderationRoutes);

// Import and use advanced moderation routes
const advancedModerationRoutes = require('./routes/advancedModeration');
app.use('/api/advanced-moderation', advancedModerationRoutes);

// Import and use admin dashboard routes
const adminDashboardRoutes = require('./routes/adminDashboard');
app.use('/api/admin-dashboard', adminDashboardRoutes);

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Dashboard backend is running on http://localhost:${PORT}`);
});
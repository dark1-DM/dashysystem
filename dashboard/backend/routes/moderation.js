const express = require('express');
const { Client } = require('discord.js');
const ModerationLog = require('../models/ModerationLog');

module.exports = (client) => {
    const router = express.Router();

    // Endpoint to kick a user
    router.post('/kick', async (req, res) => {
        const { userId, reason } = req.body;
        try {
            const guild = client.guilds.cache.first(); // Replace with specific guild logic
            const member = await guild.members.fetch(userId);
            await member.kick(reason);

            const log = new ModerationLog({ action: 'kick', userId, reason });
            await log.save();

            res.json({ message: `User ${userId} kicked for reason: ${reason}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to kick user', details: error.message });
        }
    });

    // Endpoint to ban a user
    router.post('/ban', async (req, res) => {
        const { userId, reason } = req.body;
        try {
            const guild = client.guilds.cache.first(); // Replace with specific guild logic
            const member = await guild.members.fetch(userId);
            await member.ban({ reason });

            const log = new ModerationLog({ action: 'ban', userId, reason });
            await log.save();

            res.json({ message: `User ${userId} banned for reason: ${reason}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to ban user', details: error.message });
        }
    });

    // Endpoint to mute a user
    router.post('/mute', async (req, res) => {
        const { userId, duration, reason } = req.body;
        try {
            const guild = client.guilds.cache.first(); // Replace with specific guild logic
            const member = await guild.members.fetch(userId);
            // Logic to mute the user, e.g., by removing roles or updating permissions

            const log = new ModerationLog({ action: 'mute', userId, duration, reason });
            await log.save();

            res.json({ message: `User ${userId} muted for ${duration} minutes for reason: ${reason}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mute user', details: error.message });
        }
    });

    // Endpoint to warn a user
    router.post('/warn', async (req, res) => {
        const { userId, reason } = req.body;
        try {
            const log = new ModerationLog({ action: 'warn', userId, reason });
            await log.save();

            res.json({ message: `User ${userId} warned for reason: ${reason}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to warn user', details: error.message });
        }
    });

    // Endpoint to get moderation logs
    router.get('/logs', async (req, res) => {
        try {
            const logs = await ModerationLog.find();
            res.json(logs);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve logs', details: error.message });
        }
    });

    return router;
};
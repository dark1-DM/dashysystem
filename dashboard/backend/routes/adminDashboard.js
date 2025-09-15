const express = require('express');
const { Client } = require('discord.js');
const { ServerSettings, Role, TicketSettings, MusicSettings } = require('../models/AdminDashboard');

module.exports = (client) => {
    const router = express.Router();

    // Endpoint to get server settings
    router.get('/settings', async (req, res) => {
        const { guildId } = req.query;
        try {
            const settings = await ServerSettings.findOne({ guildId });
            res.json(settings || {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve server settings', details: error.message });
        }
    });

    // Endpoint to update server settings
    router.post('/settings', async (req, res) => {
        const { guildId, prefix, modules, automodRules } = req.body;
        try {
            const settings = await ServerSettings.findOneAndUpdate(
                { guildId },
                { prefix, modules, automodRules },
                { new: true, upsert: true }
            );
            res.json({ message: 'Server settings updated successfully.', settings });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update server settings', details: error.message });
        }
    });

    // Endpoint to manage roles
    router.post('/roles', async (req, res) => {
        const { guildId, roleId, action, permissions } = req.body;
        try {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) return res.status(404).json({ error: 'Guild not found' });

            if (action === 'add') {
                const role = await guild.roles.create({
                    name: `Role ${roleId}`,
                    permissions,
                });
                await Role.create({ guildId, roleId: role.id, permissions });
                res.json({ message: `Role ${role.id} added successfully.` });
            } else if (action === 'remove') {
                const role = guild.roles.cache.get(roleId);
                if (role) await role.delete();
                await Role.deleteOne({ guildId, roleId });
                res.json({ message: `Role ${roleId} removed successfully.` });
            } else {
                res.status(400).json({ error: 'Invalid action' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to manage roles', details: error.message });
        }
    });

    // Endpoint to manage ticket settings
    router.post('/tickets', async (req, res) => {
        const { guildId, categories, buttons, autoResponses } = req.body;
        try {
            await TicketSettings.findOneAndUpdate(
                { guildId },
                { categories, buttons, autoResponses },
                { new: true, upsert: true }
            );
            res.json({ message: 'Ticket settings updated successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update ticket settings', details: error.message });
        }
    });

    // Endpoint to manage music module
    router.post('/music', async (req, res) => {
        const { guildId, volume, mode, playlists } = req.body;
        try {
            await MusicSettings.findOneAndUpdate(
                { guildId },
                { volume, mode, playlists },
                { new: true, upsert: true }
            );
            res.json({ message: 'Music module settings updated successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update music module settings', details: error.message });
        }
    });

    return router;
};
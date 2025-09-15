const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '!' },
    modules: {
        automod: { type: Boolean, default: true },
        music: { type: Boolean, default: true },
        tickets: { type: Boolean, default: true },
    },
    automodRules: { type: Array, default: [] },
});

const roleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true },
    permissions: { type: Array, default: [] },
});

const ticketSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    categories: { type: Array, default: [] },
    buttons: { type: Array, default: [] },
    autoResponses: { type: Array, default: [] },
});

const musicSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    volume: { type: Number, default: 50 },
    mode: { type: String, default: 'normal' },
    playlists: { type: Array, default: [] },
});

module.exports = {
    ServerSettings: mongoose.model('ServerSettings', serverSettingsSchema),
    Role: mongoose.model('Role', roleSchema),
    TicketSettings: mongoose.model('TicketSettings', ticketSettingsSchema),
    MusicSettings: mongoose.model('MusicSettings', musicSettingsSchema),
};
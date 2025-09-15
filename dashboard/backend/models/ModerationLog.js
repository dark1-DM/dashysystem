const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., kick, ban, mute, warn
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    duration: { type: Number, default: null }, // For mutes
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);
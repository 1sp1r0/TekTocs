'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlashCommand = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slashCommandSchema = _mongoose2.default.Schema({
    team_id: String,
    team_domain: String,
    channel_id: String,
    channel_name: String,
    user_id: String,
    user_name: String,
    command: String,
    text: String,
    response_url: String,
    pending: Boolean
});

slashCommandSchema.index({ team_id: 1, user_id: 1, command: 1 });

var SlashCommand = _mongoose2.default.model('SlashCommand', slashCommandSchema);

exports.SlashCommand = SlashCommand;
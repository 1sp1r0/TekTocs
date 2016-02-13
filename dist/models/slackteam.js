'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlackTeam = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slackTeamSchema = _mongoose2.default.Schema({
    _id: { type: String, unique: true, 'default': _shortid2.default.generate },
    ok: Boolean,
    access_token: { type: String, index: true },
    scope: String,
    team_name: String,
    team_id: { type: String, index: true },
    incoming_webhook: { url: String, channel: String, configuration_url: String },
    bot: { bot_user_id: String, bot_access_token: String }
});

var SlackTeam = _mongoose2.default.model('SlackTeam', slackTeamSchema);

exports.SlackTeam = SlackTeam;
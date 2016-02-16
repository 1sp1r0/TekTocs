'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slide = exports.SlashCommand = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _slackuser = require('./slackuser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slideSchema = _mongoose2.default.Schema({
    slideIndex: Number,
    slideText: String,
    slideCaption: String,
    slideAssetUrl: String,
    slideTitle: String,
    slideMimeType: String,
    slideMode: String
});

var Slide = _mongoose2.default.model('Slide', slideSchema);

var slashCommandSchema = _mongoose2.default.Schema({
    team_id: String,
    team_domain: String,
    channel_id: String,
    user_id: String,
    user_name: String,
    command: String,
    commandType: String,
    text: String,
    response_url: String,
    attachments: {
        slideshow: {
            start_ts: String,
            end_ts: String,
            short_id: { type: String, index: true },
            title: { type: String, index: true },
            creator: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'SlackUser' },
            slides: [slideSchema],
            published: Boolean
        }
    },
    pending: Boolean,
    createDate: Date
});

slashCommandSchema.index({ channel_id: 1, user_id: 1, commandType: 1 });

var SlashCommand = _mongoose2.default.model('SlashCommand', slashCommandSchema);

exports.SlashCommand = SlashCommand;
exports.Slide = Slide;
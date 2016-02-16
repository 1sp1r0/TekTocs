'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slide = exports.SlashCommand = exports.SlackUser = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

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

var slackUserSchema = _mongoose2.default.Schema({
    _id: String,
    short_id: { type: String, index: true },
    user_id: { type: String, index: true },
    name: String,
    first_name: String,
    last_name: String,
    real_name: String,
    email: String,
    image_24: String,
    image_32: String,
    image_48: String,
    image_72: String,
    image_192: String
});

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
            creator: { type: String, ref: 'SlackUser' },
            slides: [slideSchema],
            published: Boolean
        }
    },
    pending: Boolean,
    createDate: Date
});

slashCommandSchema.index({ channel_id: 1, user_id: 1, commandType: 1 });

var SlackUser = _mongoose2.default.model('SlackUser', slackUserSchema);
var SlashCommand = _mongoose2.default.model('SlashCommand', slashCommandSchema);

exports.SlackUser = SlackUser;
exports.SlashCommand = SlashCommand;
exports.Slide = Slide;
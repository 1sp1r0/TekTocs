'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slide = exports.SlashCommand = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slideSchema = _mongoose2.default.Schema({
    slideindex: Number,
    slideText: String,
    slideCaption: String,
    slideAssetUrl: String
});

var Slide = _mongoose2.default.model('Slide', slideSchema);

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
    attachments: {
        slideshow: {
            title: { type: [String], index: true },
            slides: [slideSchema],
            published: Boolean
        }
    },
    pending: Boolean,
    createDate: Date
});

slashCommandSchema.index({ team_id: 1, user_id: 1, command: 1 });

var SlashCommand = _mongoose2.default.model('SlashCommand', slashCommandSchema);

exports.SlashCommand = SlashCommand;
exports.Slide = Slide;
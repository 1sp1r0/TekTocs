'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlackUser = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slackUserSchema = _mongoose2.default.Schema({
    _id: String,
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

var SlackUser = _mongoose2.default.model('SlackUser', slackUserSchema);

exports.SlackUser = SlackUser;
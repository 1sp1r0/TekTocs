'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.openIm = exports.postMessageToSlack = undefined;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function postMessageToSlack(token, channel, msg) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/chat.postMessage',
        qs: {
            "token": token,
            "channel": channel,
            "text": msg,
            "as_user": true
        } });
}

function openIm(token, userId) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/im.open',
        qs: {
            "token": token,
            "user": userId
        } });
}

exports.postMessageToSlack = postMessageToSlack;
exports.openIm = openIm;
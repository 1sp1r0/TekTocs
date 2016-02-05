'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oauth = oauth;
exports.command = command;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _slackteam = require('../../models/slackteam.js');

var _slackteam2 = _interopRequireDefault(_slackteam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function oauth(req, res) {
    try {
        var querystring = _url2.default.parse(req.url, true).query;
        if (querystring.code) {
            (0, _requestPromise2.default)('https://slack.com/api/oauth.access?client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&code=' + querystring.code).then(getSlackAuthToken, requestErrorHandler);
        }
    } catch (error) {
        _logger2.default.log('error', error);
    } finally {
        res.sendStatus(200);
    }
}

function command(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }

    //res.sendStatus(200);
}

function requestErrorHandler(error) {
    _logger2.default.log('error', error);
}

function getSlackAuthToken(body) {
    try {
        var result = JSON.parse(body);
        if (result.ok) {
            _slackteam2.default.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    _logger2.default.log('error', { err: err, raw: raw });
                }
            });
        } else {
            _logger2.default.log('error', result.error);
        }
    } catch (err) {
        _logger2.default.log('error', err);
    }
}
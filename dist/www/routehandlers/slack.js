'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oauth = oauth;
exports.command = command;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _slackteam = require('../../models/slackteam.js');

var _slackteam2 = _interopRequireDefault(_slackteam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function oauth(req, res) {
    try {
        (function () {
            var querystring = _url2.default.parse(req.url, true).query;
            if (querystring.code) {
                (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                    var body, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _context.next = 3;
                                    return (0, _request2.default)('https://slack.com/api/oauth.access?client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&code=' + querystring.code);

                                case 3:
                                    body = _context.sent;

                                    res.status(200).send('body');
                                    return _context.abrupt('return');

                                case 10:
                                    res.sendStatus(200);
                                    _context.next = 15;
                                    break;

                                case 13:
                                    _logger2.default.log('error', result.error);
                                    res.send(result.error);

                                case 15:
                                    _context.next = 21;
                                    break;

                                case 17:
                                    _context.prev = 17;
                                    _context.t0 = _context['catch'](0);

                                    _logger2.default.log('error', _context.t0);
                                    res.send(_context.t0);

                                case 21:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 17]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err);
                    res.send(err);
                });
            }
        })();
    } catch (err) {
        res.send(err);
    }
}

function command(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }
}

function saveSlackAuthToken(result) {
    return new Promise(function (resolve, reject) {
        try {
            _slackteam2.default.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    reject(err);
                } else {
                    resolve(raw);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}
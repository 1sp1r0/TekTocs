'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oauth = oauth;
exports.command = command;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _generatorRunner = require('../../generatorRunner');

var _generatorRunner2 = _interopRequireDefault(_generatorRunner);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _slackteam = require('../../models/slackteam.js');

var _slackteam2 = _interopRequireDefault(_slackteam);

require('babel-polyfill');

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
                                    return (0, _requestPromise2.default)('https://slack.com/api/oauth.access?client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&code=' + querystring.code);

                                case 3:
                                    body = _context.sent;
                                    result = JSON.parse(body);

                                    if (!result.ok) {
                                        _context.next = 11;
                                        break;
                                    }

                                    _context.next = 8;
                                    return saveSlackAuthToken(result);

                                case 8:
                                    res.sendStatus(200);
                                    _context.next = 13;
                                    break;

                                case 11:
                                    _logger2.default.log('error', result.error);
                                    res.sendStatus(500);

                                case 13:
                                    _context.next = 19;
                                    break;

                                case 15:
                                    _context.prev = 15;
                                    _context.t0 = _context['catch'](0);

                                    _logger2.default.log('error', _context.t0.message);
                                    res.sendStatus(500);

                                case 19:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 15]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err.stack);
                    res.sendStatus(500);
                });
            }
        })();
    } catch (err) {
        res.send(err.message);
        res.sendStatus(500);
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
                    //resolve(raw);
                    reject('simulated error');
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}
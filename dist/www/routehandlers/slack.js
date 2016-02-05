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
        var querystring = _url2.default.parse(req.url, true).query;
        if (querystring.code) {
            var body = (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                var _body, result;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return (0, _requestPromise2.default)('http://www.yahoo.com');

                            case 3:
                                _body = _context.sent;
                                return _context.abrupt('return', _body);

                            case 9:
                                res.sendStatus(200);
                                _context.next = 14;
                                break;

                            case 12:
                                _logger2.default.log('error', result.error);
                                res.send(result.error);

                            case 14:
                                _context.next = 19;
                                break;

                            case 16:
                                _context.prev = 16;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0);
                                //res.send(err);

                            case 19:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 16]]);
            })).catch(function (err) {
                _logger2.default.log('error', err);
                //res.send(err);
            });
            res.status(200).send(body);
        }
    } catch (err) {
        res.send(err.message);
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
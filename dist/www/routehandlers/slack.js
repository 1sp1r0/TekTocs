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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stub(x) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(x * 10);
        }, 0);
    });
}

function oauth(req, res) {
    try {
        (function () {
            var querystring = _url2.default.parse(req.url, true).query;
            if (querystring.code) {

                var generatorRunner = new _generatorRunner2.default();
                generatorRunner.runPromiseGenerator(regeneratorRuntime.mark(function _callee() {
                    var x, body, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return stub(3);

                                case 2:
                                    x = _context.sent;

                                    res.send(x);
                                    return _context.abrupt('return');

                                case 8:
                                    body = _context.sent;

                                    res.status(200).send('body');
                                    return _context.abrupt('return');

                                case 15:
                                    res.sendStatus(200);
                                    _context.next = 20;
                                    break;

                                case 18:
                                    _logger2.default.log('error', result.error);
                                    res.send(result.error);

                                case 20:
                                    _context.next = 26;
                                    break;

                                case 22:
                                    _context.prev = 22;
                                    _context.t0 = _context['catch'](5);

                                    _logger2.default.log('error', _context.t0);
                                    res.send(_context.t0);

                                case 26:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[5, 22]]);
                }));
                /*.catch((err) => {
                    winston.log('error', err);
                    res.send(err);
                });*/
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
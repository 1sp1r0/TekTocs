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

var _marked = [promiseTest].map(regeneratorRuntime.mark);

function stub(x) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(x * 10);
        }, 0);
    });
}
function promiseTest() {
    var x, y, z;
    return regeneratorRuntime.wrap(function promiseTest$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return stub(3);

                case 2:
                    x = _context.sent;
                    _context.next = 5;
                    return stub(6);

                case 5:
                    y = _context.sent;
                    _context.next = 8;
                    return stub(8);

                case 8:
                    z = _context.sent;

                    console.log(x + y + z);

                case 10:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}
function oauth(req, res) {
    try {
        (function () {
            var querystring = _url2.default.parse(req.url, true).query;
            if (querystring.code) {

                var generatorRunner = new _generatorRunner2.default();
                generatorRunner.runPromiseGenerator(regeneratorRuntime.mark(function _callee() {
                    var x, body, result;
                    return regeneratorRuntime.wrap(function _callee$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return stub(3);

                                case 2:
                                    x = _context2.sent;
                                    return _context2.abrupt('return');

                                case 7:
                                    body = _context2.sent;

                                    res.status(200).send('body');
                                    return _context2.abrupt('return');

                                case 14:
                                    res.sendStatus(200);
                                    _context2.next = 19;
                                    break;

                                case 17:
                                    _logger2.default.log('error', result.error);
                                    res.send(result.error);

                                case 19:
                                    _context2.next = 25;
                                    break;

                                case 21:
                                    _context2.prev = 21;
                                    _context2.t0 = _context2['catch'](4);

                                    _logger2.default.log('error', _context2.t0);
                                    res.send(_context2.t0);

                                case 25:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee, this, [[4, 21]]);
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
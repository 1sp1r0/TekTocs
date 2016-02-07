'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.startLive = startLive;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _models = require('../../models/');

var Models = _interopRequireWildcard(_models);

require('babel-polyfill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }
}

function startLive(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
            var result, slashCommand, saveResult;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            result = JSON.parse(req.body);

                            if (!result.ok) {
                                _context.next = 10;
                                break;
                            }

                            slashCommand = new Models.SlashCommand(result);
                            _context.next = 6;
                            return slashCommand.save();

                        case 6:
                            saveResult = _context.sent;

                            res.status(200).send('Hello ' + result.channel.id, 200);

                            _context.next = 11;
                            break;

                        case 10:
                            res.status(200).send('Error ' + body, 200);

                        case 11:
                            _context.next = 17;
                            break;

                        case 13:
                            _context.prev = 13;
                            _context.t0 = _context['catch'](0);

                            _logger2.default.log('error', _context.t0);
                            res.sendStatus(500);

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 13]]);
        })).catch(function (err) {
            _logger2.default.log('error', err.stack);
            res.sendStatus(500);
        });;
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }
}

function saveSlashCommand(result) {
    return new Promise(function (resolve, reject) {
        try {
            SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
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
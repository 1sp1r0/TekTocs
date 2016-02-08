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

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

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
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                var slashCommand, slackTeam;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                slashCommand = new Models.SlashCommand({ team_id: req.body.team_id,
                                    team_domain: req.body.team_domain,
                                    channel_id: req.body.channel_id,
                                    channel_name: req.body.channel_name,
                                    user_id: req.body.user_id,
                                    user_name: req.body.user_name,
                                    command: req.body.command,
                                    text: req.body.text,
                                    response_url: req.body.response_url,
                                    pending: true });
                                _context.next = 4;
                                return slashCommand.save();

                            case 4:
                                _context.next = 6;
                                return Models.SlackTeam.findOne({ team_id: slashCommand.team_id });

                            case 6:
                                slackTeam = _context.sent;

                                if (slackTeam) {
                                    if (req.app.slackbot.slack) {
                                        req.app.slackbot.slack.removeSlackListeners();
                                        _logger2.default.log('info', req.app.slackbot.slack);
                                        // req.app.slackbot.slack.disconnect();
                                    }
                                    req.app.slackbot.slack = new _slackClient2.default(slackTeam.bot.bot_access_token, false, false);
                                    req.app.slackbot.slack.login();
                                    req.app.slackbot.removeSlackListeners();
                                    //req.app.slackbot.registerSlackListeners();
                                }
                                res.status(200).send('Hello ' + req.body.channel_id, 200);
                                _context.next = 15;
                                break;

                            case 11:
                                _context.prev = 11;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0.stack);
                                res.sendStatus(500);

                            case 15:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 11]]);
            })).catch(function (err) {
                _logger2.default.log('error', err.stack);
                res.sendStatus(500);
            });;
        } else {
            _logger2.default.log('warn', 'unauthorized slash command access');
        }
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
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
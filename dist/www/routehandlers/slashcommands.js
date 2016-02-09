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

var _slackhelper = require('../../helpers/slackhelper');

var slackhelper = _interopRequireWildcard(_slackhelper);

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
                var slackTeam, imResponse, im;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;

                                if (!(req.body.text.trim() === '')) {
                                    _context.next = 4;
                                    break;
                                }

                                res.status(200).send('Every slideshow needs a title. Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"');
                                return _context.abrupt('return');

                            case 4:
                                _context.next = 6;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 6:
                                slackTeam = _context.sent;

                                if (!slackTeam) {
                                    _context.next = 25;
                                    break;
                                }

                                if (req.app.slackbot.slack.token != slackTeam.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(slackTeam.bot.bot_access_token, true, true);
                                    req.app.slackbot.slack.login();
                                    req.app.slackbot.registerSlackListeners();
                                }
                                _context.next = 11;
                                return slackhelper.openIm(slackTeam.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context.next = 21;
                                    break;
                                }

                                _context.next = 16;
                                return saveSlashCommand(req.body, im.channel.id);

                            case 16:
                                _context.next = 18;
                                return slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token, im.channel.id, 'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');

                            case 18:
                                res.status(200).send('Got it! Our friendly bot, tektocs, has instructions for you on how to create your slideshow. Check tektoc\'s direct message channel.');
                                _context.next = 23;
                                break;

                            case 21:
                                _logger2.default.log('error', im.error);
                                res.status(500).send('Could not open direct message channel with our bot, tektocs');

                            case 23:
                                _context.next = 27;
                                break;

                            case 25:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 27:
                                _context.next = 33;
                                break;

                            case 29:
                                _context.prev = 29;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0.stack);
                                res.sendStatus(500);

                            case 33:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 29]]);
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

function saveSlashCommand(body, channelId) {

    var slashCommand = new Models.SlashCommand({ team_id: body.team_id,
        team_domain: body.team_domain,
        channel_id: channelId,
        user_id: body.user_id,
        user_name: body.user_name,
        command: body.command,
        commandType: body.command === '/tektocs-start' || body.command === '/tektocs-startlive' ? 'start' : '',
        text: body.text,
        response_url: body.response_url,
        pending: true });
    return slashCommand.save();
}
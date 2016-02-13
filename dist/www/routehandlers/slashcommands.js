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

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

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
                var slackTeam, imResponse, im, user, userInfoResponse, userInfo;
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
                                    _context.next = 48;
                                    break;
                                }

                                if (req.app.slackbot.slack.token != slackTeam.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(slackTeam.bot.bot_access_token, true, true);
                                    req.app.slackbot.registerSlackListeners();
                                }
                                _context.next = 11;
                                return slackhelper.openIm(slackTeam.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context.next = 44;
                                    break;
                                }

                                _context.next = 16;
                                return Models.SlackUser.findOne({ user_id: req.body.user_id });

                            case 16:
                                user = _context.sent;

                                if (user) {
                                    _context.next = 31;
                                    break;
                                }

                                _context.next = 20;
                                return slackhelper.getUserinfo(slackTeam.bot.bot_access_token, req.body.user_id);

                            case 20:
                                userInfoResponse = _context.sent;
                                userInfo = JSON.parse(userInfoResponse);

                                if (!userInfo.ok) {
                                    _context.next = 28;
                                    break;
                                }

                                _context.next = 25;
                                return saveSlackUser(userInfo.user);

                            case 25:
                                user = _context.sent;
                                _context.next = 31;
                                break;

                            case 28:
                                _logger2.default.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return _context.abrupt('return');

                            case 31:
                                if (!user) {
                                    _context.next = 40;
                                    break;
                                }

                                _context.next = 34;
                                return saveSlashCommand(req.body, im.channel.id, user._id);

                            case 34:
                                req.app.slackbot.slack.login();
                                _context.next = 37;
                                return slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token, im.channel.id, 'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');

                            case 37:
                                res.status(200).send('Got it! Our friendly bot, tektocs, has instructions for you on how to create your slideshow. Check tektoc\'s direct message channel.');
                                _context.next = 42;
                                break;

                            case 40:
                                _logger2.default.log('error', 'Could not retrieve user info.');
                                res.status(500).send('Could not retrieve user info.');

                            case 42:
                                _context.next = 46;
                                break;

                            case 44:
                                _logger2.default.log('error', im.error);
                                res.status(500).send('Could not open direct message channel with our bot, tektocs');

                            case 46:
                                _context.next = 50;
                                break;

                            case 48:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 50:
                                _context.next = 56;
                                break;

                            case 52:
                                _context.prev = 52;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0.stack);
                                res.sendStatus(500);

                            case 56:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 52]]);
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

function saveSlashCommand(body, channelId, userid) {

    var slashCommand = new Models.SlashCommand({ team_id: body.team_id,
        team_domain: body.team_domain,
        channel_id: channelId,
        user_id: body.user_id,
        user_name: body.user_name,
        command: body.command,
        commandType: body.command === '/tektocs-start' || body.command === '/tektocs-startlive' ? 'start' : '',
        text: body.text,
        response_url: body.response_url,
        attachments: {
            slideshow: {
                title: body.text,
                shortid: _shortid2.default.generate(),
                creator: userid,
                slides: [],
                published: false
            }
        },
        pending: true });
    return slashCommand.save();
}

function saveSlackUser(userInfo) {
    return new Promise(function (resolve, reject) {
        try {
            Models.SlackUser.update({ user_id: userInfo.id }, Object.assign({}, userInfo.profile, { user_id: userInfo.id, name: userInfo.name }), { upsert: true }, function (err, raw) {
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
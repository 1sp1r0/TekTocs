'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.end = end;
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
        res.status(200).send('Hello start' + req.body.user_name, 200);
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }
}

function end(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                var slackTeam, endingTs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 3:
                                slackTeam = _context.sent;

                                if (!slackTeam) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 7;
                                return slackhelper.getSlideshowEndingTimestamp('Your slideshow is now marked as complete. The next step is to publish it using the command /tektocs-publish.', req.body.user_id, slackTeam.bot.bot_access_token);

                            case 7:
                                endingTs = _context.sent;
                                _context.next = 10;
                                return Models.SlashCommand.findOneAndUpdate({
                                    team_domain: req.body.team_domain,
                                    user_id: req.body.user_id, pending: true,
                                    commandType: 'start' }, { pending: false, end_ts: endingTs }, { sort: { createDate: -1 } }).exec();

                            case 10:
                                res.sendStatus(200);
                                _context.next = 15;
                                break;

                            case 13:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 15:
                                _context.next = 21;
                                break;

                            case 17:
                                _context.prev = 17;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0.stack);
                                res.sendStatus(500);

                            case 21:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 17]]);
            })).catch(function (err) {
                _logger2.default.log('error', err.stack);
                res.sendStatus(500);
            });
        } else {
            _logger2.default.log('warn', 'unauthorized slash command access');
        }
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function startLive(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
                var _slackTeam, imResponse, im, user, userInfoResponse, userInfo, postMessageResponse, postMessage;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;

                                if (!(req.body.text.trim() === '')) {
                                    _context2.next = 4;
                                    break;
                                }

                                res.status(200).send('Every slideshow needs a title. Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"');
                                return _context2.abrupt('return');

                            case 4:
                                _context2.next = 6;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 6:
                                _slackTeam = _context2.sent;

                                if (!_slackTeam) {
                                    _context2.next = 55;
                                    break;
                                }

                                if (req.app.slackbot.slack.token != _slackTeam.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(_slackTeam.bot.bot_access_token, true, true);
                                    req.app.slackbot.registerSlackListeners();
                                }
                                _context2.next = 11;
                                return slackhelper.openIm(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context2.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context2.next = 51;
                                    break;
                                }

                                _context2.next = 16;
                                return Models.SlackUser.findOne({ user_id: req.body.user_id });

                            case 16:
                                user = _context2.sent;

                                if (user) {
                                    _context2.next = 31;
                                    break;
                                }

                                _context2.next = 20;
                                return slackhelper.getUserinfo(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 20:
                                userInfoResponse = _context2.sent;
                                userInfo = JSON.parse(userInfoResponse);

                                if (!userInfo.ok) {
                                    _context2.next = 28;
                                    break;
                                }

                                _context2.next = 25;
                                return saveSlackUser(userInfo.user);

                            case 25:
                                user = _context2.sent;
                                _context2.next = 31;
                                break;

                            case 28:
                                _logger2.default.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return _context2.abrupt('return');

                            case 31:
                                if (!user) {
                                    _context2.next = 47;
                                    break;
                                }

                                _context2.next = 34;
                                return slackhelper.postMessageToSlack(_slackTeam.bot.bot_access_token, im.channel.id, 'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');

                            case 34:
                                postMessageResponse = _context2.sent;
                                postMessage = JSON.parse(postMessageResponse);

                                if (!postMessage.ok) {
                                    _context2.next = 43;
                                    break;
                                }

                                _context2.next = 39;
                                return saveSlashCommand(req.body, im.channel.id, user._id, postMessage.ts);

                            case 39:
                                req.app.slackbot.slack.login();
                                res.status(200).send('Got it! Our friendly bot, tektocs, has instructions for you on how to create your slideshow. Check tektoc\'s direct message channel.');
                                _context2.next = 45;
                                break;

                            case 43:
                                _logger2.default.log('error', postMessage.error);
                                res.status(500).send('Sorry, we had trouble waking up our bot, Tektocs.');

                            case 45:
                                _context2.next = 49;
                                break;

                            case 47:
                                _logger2.default.log('error', 'Could not retrieve user info.');
                                res.status(500).send('Could not retrieve user info.');

                            case 49:
                                _context2.next = 53;
                                break;

                            case 51:
                                _logger2.default.log('error', im.error);
                                res.status(500).send('Could not open direct message channel with our bot, tektocs');

                            case 53:
                                _context2.next = 57;
                                break;

                            case 55:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 57:
                                _context2.next = 63;
                                break;

                            case 59:
                                _context2.prev = 59;
                                _context2.t0 = _context2['catch'](0);

                                _logger2.default.log('error', _context2.t0.stack);
                                res.sendStatus(500);

                            case 63:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 59]]);
            })).catch(function (err) {
                _logger2.default.log('error', err.stack);
                res.sendStatus(500);
            });
        } else {
            _logger2.default.log('warn', 'unauthorized slash command access');
        }
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function saveSlashCommand(body, channelId, userid, startTs) {

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
                start_ts: startTs,
                title: body.text,
                short_id: _shortid2.default.generate(),
                creator: userid,
                slides: [],
                published: false
            }
        },
        pending: true,
        createDate: new Date() });
    return slashCommand.save();
}

function saveSlackUser(userInfo) {
    return new Promise(function (resolve, reject) {
        try {
            Models.SlackUser.update({ user_id: userInfo.id }, Object.assign({}, userInfo.profile, { user_id: userInfo.id, name: userInfo.name, short_id: _shortid2.default.generate() }), { upsert: true }, function (err, raw) {
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
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.publish = publish;
exports.end = end;
exports.start = start;
exports.startLive = startLive;
exports.startSlideshow = startSlideshow;

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

function publish(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
                var _this = this;

                var _ret;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                return _context5.delegateYield(regeneratorRuntime.mark(function _callee4() {
                                    var slackTeam, _ret2;

                                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    _context4.next = 2;
                                                    return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                                                case 2:
                                                    slackTeam = _context4.sent;

                                                    if (!slackTeam) {
                                                        _context4.next = 10;
                                                        break;
                                                    }

                                                    return _context4.delegateYield(regeneratorRuntime.mark(function _callee3() {
                                                        var slashCommand, response, msgResponse, _ret3;

                                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                            while (1) {
                                                                switch (_context3.prev = _context3.next) {
                                                                    case 0:
                                                                        _context3.next = 2;
                                                                        return Models.SlashCommand.findOne({
                                                                            team_domain: req.body.team_domain,
                                                                            user_id: req.body.user_id, pending: false,
                                                                            'attachments.slideshow.published': false,
                                                                            commandType: 'start' }, { channel_id: 1, 'attachments.slideshow': 1 }, { sort: { createDate: -1 } }).exec();

                                                                    case 2:
                                                                        slashCommand = _context3.sent;

                                                                        if (slashCommand) {
                                                                            _context3.next = 8;
                                                                            break;
                                                                        }

                                                                        _logger2.default.log('error', 'Could not find any unpublished slideshows for:' + req.body.team_domain + ',' + req.body.user_id);
                                                                        res.status(200).send('Could not find any unpublished slideshows.');
                                                                        _context3.next = 21;
                                                                        break;

                                                                    case 8:
                                                                        _context3.next = 10;
                                                                        return slackhelper.getImHistory(slackTeam.bot.bot_access_token, slashCommand.channel_id, slashCommand.attachments.slideshow.start_ts, slashCommand.attachments.slideshow.end_ts, 1000, null);

                                                                    case 10:
                                                                        response = _context3.sent;
                                                                        msgResponse = JSON.parse(response);

                                                                        if (!msgResponse.ok) {
                                                                            _context3.next = 19;
                                                                            break;
                                                                        }

                                                                        return _context3.delegateYield(regeneratorRuntime.mark(function _callee2() {
                                                                            var messages, slideIndex;
                                                                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                                                while (1) {
                                                                                    switch (_context2.prev = _context2.next) {
                                                                                        case 0:
                                                                                            messages = msgResponse.messages;

                                                                                            res.status(200).send(messages.length);
                                                                                            return _context2.abrupt('return', {
                                                                                                v: {
                                                                                                    v: {
                                                                                                        v: undefined
                                                                                                    }
                                                                                                }
                                                                                            });

                                                                                        case 8:
                                                                                        case 'end':
                                                                                            return _context2.stop();
                                                                                    }
                                                                                }
                                                                            }, _callee2, _this);
                                                                        })(), 't0', 14);

                                                                    case 14:
                                                                        _ret3 = _context3.t0;

                                                                        if (!((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object")) {
                                                                            _context3.next = 17;
                                                                            break;
                                                                        }

                                                                        return _context3.abrupt('return', _ret3.v);

                                                                    case 17:
                                                                        _context3.next = 21;
                                                                        break;

                                                                    case 19:
                                                                        _logger2.default.log('error', response.error);
                                                                        res.status(500).send('Could not retrieve messages from the Slack channel.');

                                                                    case 21:
                                                                    case 'end':
                                                                        return _context3.stop();
                                                                }
                                                            }
                                                        }, _callee3, _this);
                                                    })(), 't0', 5);

                                                case 5:
                                                    _ret2 = _context4.t0;

                                                    if (!((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object")) {
                                                        _context4.next = 8;
                                                        break;
                                                    }

                                                    return _context4.abrupt('return', _ret2.v);

                                                case 8:
                                                    _context4.next = 12;
                                                    break;

                                                case 10:
                                                    _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                                    res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                                                case 12:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, _this);
                                })(), 't0', 2);

                            case 2:
                                _ret = _context5.t0;

                                if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                                    _context5.next = 5;
                                    break;
                                }

                                return _context5.abrupt('return', _ret.v);

                            case 5:
                                _context5.next = 11;
                                break;

                            case 7:
                                _context5.prev = 7;
                                _context5.t1 = _context5['catch'](0);

                                _logger2.default.log('error', _context5.t1.stack);
                                res.sendStatus(500);

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 7]]);
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

function end(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee6() {
                var slackTeam, endingTs;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                _context6.next = 3;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 3:
                                slackTeam = _context6.sent;

                                if (!slackTeam) {
                                    _context6.next = 13;
                                    break;
                                }

                                _context6.next = 7;
                                return slackhelper.getSlideshowEndingTimestamp('Your slideshow is now marked as complete. The next step is to publish it using the command /tektocs-publish.', req.body.user_id, slackTeam.bot.bot_access_token);

                            case 7:
                                endingTs = _context6.sent;
                                _context6.next = 10;
                                return Models.SlashCommand.findOneAndUpdate({
                                    team_domain: req.body.team_domain,
                                    user_id: req.body.user_id, pending: true,
                                    commandType: 'start' }, { pending: false, 'attachments.slideshow.end_ts': endingTs }, { sort: { createDate: -1 } }).exec();

                            case 10:
                                res.sendStatus(200);
                                _context6.next = 15;
                                break;

                            case 13:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 15:
                                _context6.next = 21;
                                break;

                            case 17:
                                _context6.prev = 17;
                                _context6.t0 = _context6['catch'](0);

                                _logger2.default.log('error', _context6.t0.stack);
                                res.sendStatus(500);

                            case 21:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[0, 17]]);
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

function start(req, res) {
    startSlideshow(req, res, false);
}

function startLive(req, res) {
    startSlideshow(req, res, true);
}

function startSlideshow(req, res, isLive) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee7() {
                var _slackTeam, imResponse, im, user, userInfoResponse, userInfo, postMessageResponse, postMessage;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;

                                if (!(req.body.text.trim() === '')) {
                                    _context7.next = 4;
                                    break;
                                }

                                res.status(200).send('Every slideshow needs a title. Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"');
                                return _context7.abrupt('return');

                            case 4:
                                _context7.next = 6;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 6:
                                _slackTeam = _context7.sent;

                                if (!_slackTeam) {
                                    _context7.next = 55;
                                    break;
                                }

                                if (isLive && req.app.slackbot.slack.token != _slackTeam.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(_slackTeam.bot.bot_access_token, true, true);
                                    req.app.slackbot.registerSlackListeners();
                                }
                                _context7.next = 11;
                                return slackhelper.openIm(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context7.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context7.next = 51;
                                    break;
                                }

                                _context7.next = 16;
                                return Models.SlackUser.findOne({ user_id: req.body.user_id });

                            case 16:
                                user = _context7.sent;

                                if (user) {
                                    _context7.next = 31;
                                    break;
                                }

                                _context7.next = 20;
                                return slackhelper.getUserinfo(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 20:
                                userInfoResponse = _context7.sent;
                                userInfo = JSON.parse(userInfoResponse);

                                if (!userInfo.ok) {
                                    _context7.next = 28;
                                    break;
                                }

                                _context7.next = 25;
                                return saveSlackUser(userInfo.user);

                            case 25:
                                user = _context7.sent;
                                _context7.next = 31;
                                break;

                            case 28:
                                _logger2.default.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return _context7.abrupt('return');

                            case 31:
                                if (!user) {
                                    _context7.next = 47;
                                    break;
                                }

                                _context7.next = 34;
                                return slackhelper.postMessageToSlack(_slackTeam.bot.bot_access_token, im.channel.id, 'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');

                            case 34:
                                postMessageResponse = _context7.sent;
                                postMessage = JSON.parse(postMessageResponse);

                                if (!postMessage.ok) {
                                    _context7.next = 43;
                                    break;
                                }

                                _context7.next = 39;
                                return saveStartSlashCommand(req.body, im.channel.id, user._id, postMessage.ts);

                            case 39:
                                req.app.slackbot.slack.login();
                                res.status(200).send('Got it! Our friendly bot, tektocs, has instructions for you on how to create your slideshow. Check tektoc\'s direct message channel.');
                                _context7.next = 45;
                                break;

                            case 43:
                                _logger2.default.log('error', postMessage.error);
                                res.status(500).send('Sorry, we had trouble waking up our bot, Tektocs.');

                            case 45:
                                _context7.next = 49;
                                break;

                            case 47:
                                _logger2.default.log('error', 'Could not retrieve user info.');
                                res.status(500).send('Could not retrieve user info.');

                            case 49:
                                _context7.next = 53;
                                break;

                            case 51:
                                _logger2.default.log('error', im.error);
                                res.status(500).send('Could not open direct message channel with our bot, tektocs');

                            case 53:
                                _context7.next = 57;
                                break;

                            case 55:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 57:
                                _context7.next = 63;
                                break;

                            case 59:
                                _context7.prev = 59;
                                _context7.t0 = _context7['catch'](0);

                                _logger2.default.log('error', _context7.t0.stack);
                                res.sendStatus(500);

                            case 63:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 59]]);
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

function saveStartSlashCommand(body, channelId, userid, startTs) {

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
                end_ts: '',
                start_ts: startTs,
                title: body.text,
                short_id: _shortid2.default.generate(),
                creator: userid,
                slides: [],
                published: false,
                pending: true
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
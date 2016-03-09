'use strict';

var _templateObject = _taggedTemplateLiteral(['noUnpublishedSlideshowsFound'], ['noUnpublishedSlideshowsFound']),
    _templateObject2 = _taggedTemplateLiteral(['slideshowHasBeenPublished'], ['slideshowHasBeenPublished']),
    _templateObject3 = _taggedTemplateLiteral(['couldNotretrieveSlackmessage'], ['couldNotretrieveSlackmessage']),
    _templateObject4 = _taggedTemplateLiteral(['didNotFindrecord'], ['didNotFindrecord']),
    _templateObject5 = _taggedTemplateLiteral(['somethingDoesntSeemToBeRight'], ['somethingDoesntSeemToBeRight']),
    _templateObject6 = _taggedTemplateLiteral(['unauthorizedSlashCommandAccess'], ['unauthorizedSlashCommandAccess']),
    _templateObject7 = _taggedTemplateLiteral(['couldNotProcessMessageAsSlide'], ['couldNotProcessMessageAsSlide']),
    _templateObject8 = _taggedTemplateLiteral(['slideshowMarkedAsComplete'], ['slideshowMarkedAsComplete']),
    _templateObject9 = _taggedTemplateLiteral(['slideshowRequiresTitle'], ['slideshowRequiresTitle']),
    _templateObject10 = _taggedTemplateLiteral(['couldNotRetriveUserInfo'], ['couldNotRetriveUserInfo']),
    _templateObject11 = _taggedTemplateLiteral(['letsGetStartedWithTheSlideshow'], ['letsGetStartedWithTheSlideshow']),
    _templateObject12 = _taggedTemplateLiteral(['letsGetStartedWithTheLiveSlideshow'], ['letsGetStartedWithTheLiveSlideshow']),
    _templateObject13 = _taggedTemplateLiteral(['readyToAddSlides'], ['readyToAddSlides']),
    _templateObject14 = _taggedTemplateLiteral(['troubleWakingUpBot'], ['troubleWakingUpBot']),
    _templateObject15 = _taggedTemplateLiteral(['couldNotOpenDMChannelWithBot'], ['couldNotOpenDMChannelWithBot']);

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

var _tag = require('../../helpers/tag');

var _tag2 = _interopRequireDefault(_tag);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function publish(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                return _context4.delegateYield(regeneratorRuntime.mark(function _callee3() {
                                    var slackTeam;
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    _context3.next = 2;
                                                    return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                                                case 2:
                                                    slackTeam = _context3.sent;

                                                    if (!slackTeam) {
                                                        _context3.next = 7;
                                                        break;
                                                    }

                                                    return _context3.delegateYield(regeneratorRuntime.mark(function _callee2() {
                                                        var slashCommand, response, msgResponse;
                                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                            while (1) {
                                                                switch (_context2.prev = _context2.next) {
                                                                    case 0:
                                                                        _context2.next = 2;
                                                                        return Models.SlashCommand.findOne({
                                                                            team_domain: req.body.team_domain,
                                                                            user_id: req.body.user_id, pending: false,
                                                                            'attachments.slideshow.published': false,
                                                                            commandType: 'start' }, { channel_id: 1, 'attachments.slideshow': 1 }, { sort: { createDate: -1 } }).exec();

                                                                    case 2:
                                                                        slashCommand = _context2.sent;

                                                                        if (slashCommand) {
                                                                            _context2.next = 8;
                                                                            break;
                                                                        }

                                                                        _logger2.default.log('error', (0, _tag2.default)(_templateObject) + ':' + req.body.team_domain + ',' + req.body.user_id);
                                                                        res.status(200).send((0, _tag2.default)(_templateObject));
                                                                        _context2.next = 13;
                                                                        break;

                                                                    case 8:
                                                                        _context2.next = 10;
                                                                        return slackhelper.getImHistory(slackTeam.bot.bot_access_token, slashCommand.channel_id, slashCommand.attachments.slideshow.start_ts, slashCommand.attachments.slideshow.end_ts, 1000, null);

                                                                    case 10:
                                                                        response = _context2.sent;
                                                                        msgResponse = JSON.parse(response);

                                                                        if (msgResponse.ok) {
                                                                            (function () {
                                                                                var messages = msgResponse.messages.reverse();
                                                                                setImmediate(function () {
                                                                                    try {
                                                                                        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                                                                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                                                while (1) {
                                                                                                    switch (_context.prev = _context.next) {
                                                                                                        case 0:
                                                                                                            _context.next = 2;
                                                                                                            return processMessages(messages, slashCommand, slackTeam.bot.bot_access_token);

                                                                                                        case 2:
                                                                                                            slashCommand.attachments.slideshow.published = true;
                                                                                                            _context.next = 5;
                                                                                                            return slashCommand.attachments.slideshow.save();

                                                                                                        case 5:
                                                                                                        case 'end':
                                                                                                            return _context.stop();
                                                                                                    }
                                                                                                }
                                                                                            }, _callee, this);
                                                                                        })).catch(function (err) {
                                                                                            _logger2.default.log('error', err.stack);
                                                                                        });
                                                                                    } catch (err) {
                                                                                        _logger2.default.log('error', err.stack);
                                                                                    }
                                                                                });
                                                                                res.status(200).send((0, _tag2.default)(_templateObject2));
                                                                            })();
                                                                        } else {
                                                                            _logger2.default.log('error', response.error);
                                                                            res.status(500).send((0, _tag2.default)(_templateObject3));
                                                                        }

                                                                    case 13:
                                                                    case 'end':
                                                                        return _context2.stop();
                                                                }
                                                            }
                                                        }, _callee2, _this);
                                                    })(), 't0', 5);

                                                case 5:
                                                    _context3.next = 9;
                                                    break;

                                                case 7:
                                                    _logger2.default.log('error', (0, _tag2.default)(_templateObject4) + ':' + req.body.team_id + '(' + req.body.team_domain + ')');
                                                    res.status(500).send((0, _tag2.default)(_templateObject5));

                                                case 9:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                })(), 't0', 2);

                            case 2:
                                _context4.next = 8;
                                break;

                            case 4:
                                _context4.prev = 4;
                                _context4.t1 = _context4['catch'](0);

                                _logger2.default.log('error', _context4.t1.stack);
                                res.sendStatus(500);

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 4]]);
            })).catch(function (err) {
                _logger2.default.log('error', err.stack);
                res.sendStatus(500);
            });
        } else {
            _logger2.default.log('warn', (0, _tag2.default)(_templateObject6));
        }
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function processMessages(messages, slashCommand, botAcessToken) {

    var slideIndex = 1;
    try {
        return messages.map(function (m) {
            return new Promise(function (resolve, reject) {
                (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
                    var slide;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    _context5.prev = 0;
                                    _context5.next = 3;
                                    return slackhelper.getSlide(m, slideIndex++, botAcessToken, slashCommand.attachments.slideshow.short_id);

                                case 3:
                                    slide = _context5.sent;

                                    if (slide) {
                                        slashCommand.attachments.slideshow.slides.push(slide);
                                        resolve(true);
                                    } else {
                                        reject((0, _tag2.default)(_templateObject7));
                                        _logger2.default.log('error', (0, _tag2.default)(_templateObject7));
                                    }

                                    _context5.next = 11;
                                    break;

                                case 7:
                                    _context5.prev = 7;
                                    _context5.t0 = _context5['catch'](0);

                                    _logger2.default.log('error', _context5.t0.stack);
                                    reject(_context5.t0.stack);

                                case 11:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this, [[0, 7]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err.stack);
                    reject(err.stack);
                });
            });
        });
    } catch (err) {
        _logger2.default.log('error', err.stack);
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
                                return slackhelper.getSlideshowEndingTimestamp((0, _tag2.default)(_templateObject8), req.body.user_id, slackTeam.bot.bot_access_token);

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
                                _logger2.default.log('error', (0, _tag2.default)(_templateObject4) + ':' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send((0, _tag2.default)(_templateObject5));

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
            _logger2.default.log('warn', (0, _tag2.default)(_templateObject6));
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
                var _slackTeam, imResponse, im, userDbId, user, userInfoResponse, userInfo, _user, msg, liveMsg, postMessageResponse, postMessage, savedSlashCommand;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;

                                req.app.slackbot.slack = new _slackClient2.default('', true, true);

                                if (!(req.body.text.trim() === '')) {
                                    _context7.next = 5;
                                    break;
                                }

                                res.status(200).send((0, _tag2.default)(_templateObject9));
                                return _context7.abrupt('return');

                            case 5:
                                _context7.next = 7;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 7:
                                _slackTeam = _context7.sent;

                                if (!_slackTeam) {
                                    _context7.next = 67;
                                    break;
                                }

                                _context7.next = 11;
                                return slackhelper.openIm(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context7.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context7.next = 63;
                                    break;
                                }

                                userDbId = '';
                                _context7.next = 17;
                                return Models.SlackUser.findOne({ user_id: req.body.user_id });

                            case 17:
                                user = _context7.sent;

                                if (user) {
                                    _context7.next = 35;
                                    break;
                                }

                                _context7.next = 21;
                                return slackhelper.getUserinfo(_slackTeam.bot.bot_access_token, req.body.user_id);

                            case 21:
                                userInfoResponse = _context7.sent;
                                userInfo = JSON.parse(userInfoResponse);

                                if (!userInfo.ok) {
                                    _context7.next = 30;
                                    break;
                                }

                                _context7.next = 26;
                                return saveSlackUser(userInfo.user);

                            case 26:
                                _user = _context7.sent;

                                userDbId = _user.upserted[0]._id;
                                _context7.next = 33;
                                break;

                            case 30:
                                _logger2.default.log('error', userInfo.error);
                                res.status(500).send((0, _tag2.default)(_templateObject10));
                                return _context7.abrupt('return');

                            case 33:
                                _context7.next = 36;
                                break;

                            case 35:
                                userDbId = user._id;

                            case 36:
                                if (!(userDbId != '')) {
                                    _context7.next = 59;
                                    break;
                                }

                                msg = (0, _tag2.default)(_templateObject11);
                                liveMsg = (0, _tag2.default)(_templateObject12);
                                _context7.next = 41;
                                return slackhelper.postMessageToSlack(_slackTeam.bot.bot_access_token, im.channel.id, isLive ? liveMsg : msg);

                            case 41:
                                postMessageResponse = _context7.sent;
                                postMessage = JSON.parse(postMessageResponse);

                                if (!postMessage.ok) {
                                    _context7.next = 55;
                                    break;
                                }

                                _context7.next = 46;
                                return saveStartSlashCommand(req.body, im.channel.id, userDbId, postMessage.ts, isLive);

                            case 46:
                                savedSlashCommand = _context7.sent;

                                if (!isLive) {
                                    _context7.next = 51;
                                    break;
                                }

                                _context7.next = 50;
                                return slackhelper.postMessageToSlack(_slackTeam.bot.bot_access_token, im.channel.id, 'This is the url where your slideshow will be streaming: https://tektocs.herokuapp.com/slideshows/live/' + savedSlashCommand.attachments.slideshow.creator + '/' + savedSlashCommand.attachments.slideshow.short_id);

                            case 50:
                                if (req.app.slackbot.slack.token != _slackTeam.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(_slackTeam.bot.bot_access_token, true, true);
                                    //req.app.slackbot.registerSocketIoListeners(req.app.server,req.body.user_id);
                                    req.app.slackbot.registerSlackListeners(savedSlashCommand.attachments.slideshow.creator);
                                }

                            case 51:
                                req.app.slackbot.slack.login();
                                res.status(200).send((0, _tag2.default)(_templateObject13));
                                _context7.next = 57;
                                break;

                            case 55:
                                _logger2.default.log('error', postMessage.error);
                                res.status(500).send((0, _tag2.default)(_templateObject14));

                            case 57:
                                _context7.next = 61;
                                break;

                            case 59:
                                _logger2.default.log('error', (0, _tag2.default)(_templateObject10));
                                res.status(500).send((0, _tag2.default)(_templateObject10));

                            case 61:
                                _context7.next = 65;
                                break;

                            case 63:

                                _logger2.default.log('error', im.error);
                                res.status(500).send((0, _tag2.default)(_templateObject15));

                            case 65:
                                _context7.next = 69;
                                break;

                            case 67:
                                _logger2.default.log('error', (0, _tag2.default)(_templateObject4) + ':' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send((0, _tag2.default)(_templateObject5));

                            case 69:
                                _context7.next = 75;
                                break;

                            case 71:
                                _context7.prev = 71;
                                _context7.t0 = _context7['catch'](0);

                                _logger2.default.log('error', _context7.t0.stack);
                                res.sendStatus(500);

                            case 75:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 71]]);
            })).catch(function (err) {
                _logger2.default.log('error', err.stack);
                res.sendStatus(500);
            });
        } else {
            _logger2.default.log('warn', (0, _tag2.default)(_templateObject6));
        }
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function saveStartSlashCommand(body, channelId, userid, startTs, isLive) {

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
                published: isLive,
                pending: !isLive
            }
        },
        pending: true,
        createDate: new Date() });
    return slashCommand.save();
}

function saveSlackUser(userInfo) {
    return new Promise(function (resolve, reject) {
        try {
            var short_id = _shortid2.default.generate();
            Models.SlackUser.update({ user_id: userInfo.id }, Object.assign({}, userInfo.profile, { user_id: userInfo.id, name: userInfo.name, _id: short_id }), { upsert: true }, function (err, raw) {
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
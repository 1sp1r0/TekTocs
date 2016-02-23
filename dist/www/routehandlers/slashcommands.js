'use strict';

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
            (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                var slackTeam, slashCommand, response, msgResponse, messages;
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
                                    _context.next = 31;
                                    break;
                                }

                                _context.next = 7;
                                return Models.SlashCommand.findOne({
                                    team_domain: req.body.team_domain,
                                    user_id: req.body.user_id, pending: false,
                                    'attachments.slideshow.published': false,
                                    commandType: 'start' }, { channel_id: 1, 'attachments.slideshow': 1 }, { sort: { createDate: -1 } }).exec();

                            case 7:
                                slashCommand = _context.sent;

                                if (slashCommand) {
                                    _context.next = 13;
                                    break;
                                }

                                _logger2.default.log('error', 'Could not find any unpublished slideshows for:' + req.body.team_domain + ',' + req.body.user_id);
                                res.status(200).send('Could not find any unpublished slideshows.');
                                _context.next = 29;
                                break;

                            case 13:
                                _context.next = 15;
                                return slackhelper.getImHistory(slackTeam.bot.bot_access_token, slashCommand.channel_id, slashCommand.attachments.slideshow.start_ts, slashCommand.attachments.slideshow.end_ts, 1000, null);

                            case 15:
                                response = _context.sent;
                                msgResponse = JSON.parse(response);

                                if (!msgResponse.ok) {
                                    _context.next = 27;
                                    break;
                                }

                                messages = msgResponse.messages.reverse();
                                _context.next = 21;
                                return processMessages(messages, slashCommand, slackTeam.bot.bot_access_token);

                            case 21:
                                slashCommand.attachments.slideshow.published = true;
                                _context.next = 24;
                                return slashCommand.attachments.slideshow.save();

                            case 24:
                                /*let slide = yield slackhelper.getSlide(messages[0], 1,
                                slackTeam.bot.bot_access_token,slashCommand.attachments.slideshow.short_id);
                                if (slide) {
                                slashCommand.attachments.slideshow.slides.push(slide);
                                slashCommand.attachments.slideshow.published = true;
                                yield slashCommand.attachments.slideshow.save();
                                }*/
                                res.status(200).send('Slideshow has been published.');
                                _context.next = 29;
                                break;

                            case 27:
                                _logger2.default.log('error', response.error);
                                res.status(500).send('Could not retrieve messages from the Slack channel.');

                            case 29:
                                _context.next = 33;
                                break;

                            case 31:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 33:
                                _context.next = 39;
                                break;

                            case 35:
                                _context.prev = 35;
                                _context.t0 = _context['catch'](0);

                                _logger2.default.log('error', _context.t0.stack);
                                res.sendStatus(500);

                            case 39:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 35]]);
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

function processMessages(messages, slashCommand, botAcessToken) {
    //co(function* () {
    var slideIndex = 1;
    try {
        return messages.map(function (m) {
            return new Promise(function (resolve, reject) {
                (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
                    var slide;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.prev = 0;
                                    _context2.next = 3;
                                    return slackhelper.getSlide(m, slideIndex++, botAcessToken, slashCommand.attachments.slideshow.short_id);

                                case 3:
                                    slide = _context2.sent;

                                    if (slide) {
                                        slashCommand.attachments.slideshow.slides.push(slide);
                                        resolve(true);
                                    } else {
                                        reject('Could not process message as slide');
                                        _logger2.default.log('error', 'Could not process message as slide');
                                    }

                                    _context2.next = 11;
                                    break;

                                case 7:
                                    _context2.prev = 7;
                                    _context2.t0 = _context2['catch'](0);

                                    _logger2.default.log('error', _context2.t0.stack);
                                    reject(_context2.t0.stack);

                                case 11:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this, [[0, 7]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err.stack);
                    reject(err.stack);
                });
            });
        });

        /*   messages.forEach(m=> {
               co(function* () {
                   try {
                       let slide = yield slackhelper.getSlide(m, slideIndex,
                           botAcessToken,slashCommand.attachments.slideshow.short_id);
                       if (slide) {
                           slashCommand.attachments.slideshow.slides.push(slide);
                       }
                       
                   } catch (err) {
                       winston.log('error', err.stack);
                    }
               }).catch((err) => {
                   winston.log('error', err.stack);
                });
               slideIndex = slideIndex + 1;
           });*/
        //slashCommand.attachments.slideshow.published = true;
        //yield slashCommand.attachments.slideshow.save();
    } catch (err) {
        _logger2.default.log('error', err.stack);
    }
    //}).catch((err) => {
    //  winston.log('error', err.stack);

    //});
}

function end(req, res) {
    try {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
                var _slackTeam, endingTs;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 3:
                                _slackTeam = _context3.sent;

                                if (!_slackTeam) {
                                    _context3.next = 13;
                                    break;
                                }

                                _context3.next = 7;
                                return slackhelper.getSlideshowEndingTimestamp('Your slideshow is now marked as complete. The next step is to publish it using the command /tektocs-publish.', req.body.user_id, _slackTeam.bot.bot_access_token);

                            case 7:
                                endingTs = _context3.sent;
                                _context3.next = 10;
                                return Models.SlashCommand.findOneAndUpdate({
                                    team_domain: req.body.team_domain,
                                    user_id: req.body.user_id, pending: true,
                                    commandType: 'start' }, { pending: false, 'attachments.slideshow.end_ts': endingTs }, { sort: { createDate: -1 } }).exec();

                            case 10:
                                res.sendStatus(200);
                                _context3.next = 15;
                                break;

                            case 13:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 15:
                                _context3.next = 21;
                                break;

                            case 17:
                                _context3.prev = 17;
                                _context3.t0 = _context3['catch'](0);

                                _logger2.default.log('error', _context3.t0.stack);
                                res.sendStatus(500);

                            case 21:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 17]]);
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
            (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
                var _slackTeam2, imResponse, im, userDbId, user, userInfoResponse, userInfo, _user, postMessageResponse, postMessage;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;

                                if (!(req.body.text.trim() === '')) {
                                    _context4.next = 4;
                                    break;
                                }

                                res.status(200).send('Every slideshow needs a title. Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"');
                                return _context4.abrupt('return');

                            case 4:
                                _context4.next = 6;
                                return Models.SlackTeam.findOne({ team_id: req.body.team_id });

                            case 6:
                                _slackTeam2 = _context4.sent;

                                if (!_slackTeam2) {
                                    _context4.next = 60;
                                    break;
                                }

                                if (isLive && req.app.slackbot.slack.token != _slackTeam2.bot.bot_access_token) {
                                    req.app.slackbot.slack = new _slackClient2.default(_slackTeam2.bot.bot_access_token, true, true);
                                    req.app.slackbot.registerSlackListeners();
                                }
                                _context4.next = 11;
                                return slackhelper.openIm(_slackTeam2.bot.bot_access_token, req.body.user_id);

                            case 11:
                                imResponse = _context4.sent;
                                im = JSON.parse(imResponse);

                                if (!im.ok) {
                                    _context4.next = 56;
                                    break;
                                }

                                userDbId = '';
                                _context4.next = 17;
                                return Models.SlackUser.findOne({ user_id: req.body.user_id });

                            case 17:
                                user = _context4.sent;

                                if (user) {
                                    _context4.next = 35;
                                    break;
                                }

                                _context4.next = 21;
                                return slackhelper.getUserinfo(_slackTeam2.bot.bot_access_token, req.body.user_id);

                            case 21:
                                userInfoResponse = _context4.sent;
                                userInfo = JSON.parse(userInfoResponse);

                                if (!userInfo.ok) {
                                    _context4.next = 30;
                                    break;
                                }

                                _context4.next = 26;
                                return saveSlackUser(userInfo.user);

                            case 26:
                                _user = _context4.sent;

                                userDbId = _user.upserted[0]._id;
                                _context4.next = 33;
                                break;

                            case 30:
                                _logger2.default.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return _context4.abrupt('return');

                            case 33:
                                _context4.next = 36;
                                break;

                            case 35:
                                userDbId = user._id;

                            case 36:
                                if (!(userDbId != '')) {
                                    _context4.next = 52;
                                    break;
                                }

                                _context4.next = 39;
                                return slackhelper.postMessageToSlack(_slackTeam2.bot.bot_access_token, im.channel.id, 'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');

                            case 39:
                                postMessageResponse = _context4.sent;
                                postMessage = JSON.parse(postMessageResponse);

                                if (!postMessage.ok) {
                                    _context4.next = 48;
                                    break;
                                }

                                _context4.next = 44;
                                return saveStartSlashCommand(req.body, im.channel.id, userDbId, postMessage.ts);

                            case 44:
                                req.app.slackbot.slack.login();
                                res.status(200).send('You are now ready to add slides to your slideshow. First, change over to our bot, Tektocs\', direct messaging channel. Every message you post in that channel will be a single slide.  Happy creating!');
                                _context4.next = 50;
                                break;

                            case 48:
                                _logger2.default.log('error', postMessage.error);
                                res.status(500).send('Sorry, we had trouble waking up our bot, Tektocs.');

                            case 50:
                                _context4.next = 54;
                                break;

                            case 52:
                                _logger2.default.log('error', 'Could not retrieve user info.');
                                res.status(500).send('Could not retrieve user info.');

                            case 54:
                                _context4.next = 58;
                                break;

                            case 56:
                                _logger2.default.log('error', im.error);
                                res.status(500).send('Could not open direct message channel with our bot, tektocs');

                            case 58:
                                _context4.next = 62;
                                break;

                            case 60:
                                _logger2.default.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                                res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');

                            case 62:
                                _context4.next = 68;
                                break;

                            case 64:
                                _context4.prev = 64;
                                _context4.t0 = _context4['catch'](0);

                                _logger2.default.log('error', _context4.t0.stack);
                                res.sendStatus(500);

                            case 68:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 64]]);
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
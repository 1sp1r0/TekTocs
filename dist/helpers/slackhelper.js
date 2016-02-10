'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processMessage = exports.openIm = exports.postMessageToSlack = undefined;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _models = require('../models/');

var Models = _interopRequireWildcard(_models);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function postMessageToSlack(token, channel, msg) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/chat.postMessage',
        qs: {
            "token": token,
            "channel": channel,
            "text": msg,
            "as_user": true
        } });
}

function openIm(token, userId) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/im.open',
        qs: {
            "token": token,
            "user": userId
        } });
}

function processMessage(message) {
    return new Promise(function (resolve, reject) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
            var slashCommand, team, botAccessToken, slideIndex, slide;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return Models.SlashCommand.findOne({ channel_id: message.channel,
                                user_id: message.user, pending: true,
                                commandType: 'start' }).sort({ createDate: -1 }).limit(1).select('team_id attachments.slideshow').exec();

                        case 3:
                            slashCommand = _context.sent;

                            if (slashCommand) {
                                _context.next = 8;
                                break;
                            }

                            reject('Slideshow has not been started yet.');
                            _context.next = 24;
                            break;

                        case 8:
                            _context.next = 10;
                            return getSlackTeam(slashCommand.team_id);

                        case 10:
                            team = _context.sent;
                            botAccessToken = team.bot.bot_access_token;
                            slideIndex = getNextSlideindex(slashCommand.attachments.slideshow.slides);
                            _context.next = 15;
                            return getSlide(message, slideIndex, botAccessToken);

                        case 15:
                            slide = _context.sent;

                            if (!slide) {
                                _context.next = 23;
                                break;
                            }

                            slashCommand.attachments.slideshow.slides.push(slide);
                            _context.next = 20;
                            return slashCommand.attachments.slideshow.save();

                        case 20:
                            resolve(slide);
                            _context.next = 24;
                            break;

                        case 23:
                            reject("error getting slide data");

                        case 24:
                            _context.next = 29;
                            break;

                        case 26:
                            _context.prev = 26;
                            _context.t0 = _context['catch'](0);

                            reject(_context.t0.stack);

                        case 29:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 26]]);
        })).catch(function (err) {
            reject(err.stack);
        });
    });
}

function getNextSlideindex(slides) {
    var _Math;

    return slides.length > 0 ? (_Math = Math).max.apply(_Math, _toConsumableArray(slides.map(function (slide) {
        return slide.slideIndex;
    }))) + 1 : 1;
}

function getSlide(message, slideIndex, botAccessToken) {
    return new Promise(function (resolve, reject) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
            var slideCaption, slideText, slideAssetUrl, slideMode;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            slideCaption = '';
                            slideText = '';
                            slideAssetUrl = '';
                            slideMode = '';

                            if (!(message.subtype === 'file_share')) {
                                _context2.next = 16;
                                break;
                            }

                            slideMode = message.file.mode;
                            slideAssetUrl = message.file.url_private_download;
                            if (message.file.comments_count > 0) {
                                slideCaption = message.file.initial_comment.comment;
                            }

                            if (!(message.file.mode === 'snippet')) {
                                _context2.next = 13;
                                break;
                            }

                            _context2.next = 12;
                            return getSnippetText(message.file.url_private_download, botAccessToken);

                        case 12:
                            slideText = _context2.sent;

                        case 13:
                            resolve(new Models.Slide({
                                slideIndex: slideIndex,
                                slideText: slideText,
                                slideCaption: slideCaption,
                                slideAssetUrl: slideAssetUrl,
                                slideTitle: message.file.title,
                                slideMimeType: message.file.mimetype,
                                slideMode: slideMode
                            }));
                            _context2.next = 17;
                            break;

                        case 16:
                            resolve(new Models.Slide({ slideIndex: slideIndex,
                                slideText: message.text,
                                slideCaption: '',
                                slideAssetUrl: '',
                                slideTitle: '',
                                slideMimeType: '',
                                slideMode: '' }));

                        case 17:
                            _context2.next = 22;
                            break;

                        case 19:
                            _context2.prev = 19;
                            _context2.t0 = _context2['catch'](0);

                            reject(_context2.t0.stack);

                        case 22:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 19]]);
        })).catch(function (err) {
            reject(err.stack);
        });
    });
}

function getSlackTeam(teamId) {
    return Models.SlackTeam.findOne({ team_id: teamId }).select('bot.bot_access_token').exec();
}

function getSnippetText(url, botAccessToken) {
    return new Promise(function (resolve, reject) {
        (0, _requestPromise2.default)({ headers: { 'Authorization': 'Bearer ' + botAccessToken },
            url: url }, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res.body);
            }
        });
    });
}

exports.postMessageToSlack = postMessageToSlack;
exports.openIm = openIm;
exports.processMessage = processMessage;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.postMessageToSlack = postMessageToSlack;
exports.openIm = openIm;
exports.getUserinfo = getUserinfo;
exports.getMessagesFromSlack = getMessagesFromSlack;
exports.processMessage = processMessage;
exports.getSlide = getSlide;
exports.getSlideshowEndingTimestamp = getSlideshowEndingTimestamp;

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

function getUserinfo(token, userId) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/users.info',
        qs: {
            "token": token,
            "user": userId
        } });
}

function getImHistory(token, channel, oldest, count) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/im.history',
        qs: {
            "token": token,
            "channel": channel,
            "oldest": oldest,
            "count": count
        } });
}

function getMessagesFromSlack(token, channel, startTs, endTs, count, messages) {

    (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var _ret;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
                            var oldest, latest, imHistoryResponse, imHistory;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            return _context.abrupt('return', {
                                                v: { ok: false, error: 'messages' }
                                            });

                                        case 6:
                                            imHistoryResponse = _context.sent;
                                            imHistory = JSON.parse(imHistoryResponse);

                                            if (!imHistory.ok) {
                                                _context.next = 13;
                                                break;
                                            }

                                            imHistory.messages.forEach(function (m) {
                                                if (m.ts != latest) {
                                                    messages.push(m);
                                                } else {
                                                    return { ok: true, messages: messages };
                                                }
                                            });
                                            if (imHistory.has_more) {
                                                getMessagesFromSlack(token, channel, messages[messages.length - 1].ts, latest, count, messages);
                                            }
                                            _context.next = 14;
                                            break;

                                        case 13:
                                            return _context.abrupt('return', {
                                                v: { ok: false, error: imHistory.error }
                                            });

                                        case 14:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })(), 't0', 2);

                    case 2:
                        _ret = _context2.t0;

                        if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                            _context2.next = 5;
                            break;
                        }

                        return _context2.abrupt('return', _ret.v);

                    case 5:
                        _context2.next = 10;
                        break;

                    case 7:
                        _context2.prev = 7;
                        _context2.t1 = _context2['catch'](0);
                        return _context2.abrupt('return', { ok: false, error: _context2.t1.stack });

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    })).catch(function (err) {
        return { ok: false, error: err.stack };
    });
}

function processMessage(message) {
    return new Promise(function (resolve, reject) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
            var slashCommand, team, botAccessToken, slideIndex, slide;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return Models.SlashCommand.findOne({ channel_id: message.channel,
                                user_id: message.user, pending: true,
                                commandType: 'start' }).sort({ createDate: -1 }).limit(1).select('team_id attachments.slideshow').exec();

                        case 3:
                            slashCommand = _context3.sent;

                            if (slashCommand) {
                                _context3.next = 8;
                                break;
                            }

                            reject('Slideshow has not been started yet.');
                            _context3.next = 24;
                            break;

                        case 8:
                            _context3.next = 10;
                            return getSlackTeam(slashCommand.team_id);

                        case 10:
                            team = _context3.sent;
                            botAccessToken = team.bot.bot_access_token;
                            slideIndex = getNextSlideindex(slashCommand.attachments.slideshow.slides);
                            _context3.next = 15;
                            return getSlide(message, slideIndex, botAccessToken);

                        case 15:
                            slide = _context3.sent;

                            if (!slide) {
                                _context3.next = 23;
                                break;
                            }

                            slashCommand.attachments.slideshow.slides.push(slide);
                            _context3.next = 20;
                            return slashCommand.attachments.slideshow.save();

                        case 20:
                            resolve(slide);
                            _context3.next = 24;
                            break;

                        case 23:
                            reject("error getting slide data");

                        case 24:
                            _context3.next = 29;
                            break;

                        case 26:
                            _context3.prev = 26;
                            _context3.t0 = _context3['catch'](0);

                            reject(_context3.t0.stack);

                        case 29:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 26]]);
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
        (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
            var slideCaption, slideText, slideAssetUrl, slideMode;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            slideCaption = '';
                            slideText = '';
                            slideAssetUrl = '';
                            slideMode = '';

                            if (!(message.subtype === 'file_share')) {
                                _context4.next = 16;
                                break;
                            }

                            slideMode = message.file.mode;
                            slideAssetUrl = message.file.url_private_download;
                            if (message.file.comments_count > 0) {
                                slideCaption = message.file.initial_comment.comment;
                            }

                            if (!(message.file.mode === 'snippet')) {
                                _context4.next = 13;
                                break;
                            }

                            _context4.next = 12;
                            return getSnippetText(message.file.url_private_download, botAccessToken);

                        case 12:
                            slideText = _context4.sent;

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
                            _context4.next = 17;
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
                            _context4.next = 22;
                            break;

                        case 19:
                            _context4.prev = 19;
                            _context4.t0 = _context4['catch'](0);

                            reject(_context4.t0.stack);

                        case 22:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[0, 19]]);
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

function getSlideshowEndingTimestamp(message, userId, botAccessToken) {
    return new Promise(function (resolve, reject) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
            var imResponse, im, postMessageResponse, postMessage;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return openIm(botAccessToken, userId);

                        case 3:
                            imResponse = _context5.sent;
                            im = JSON.parse(imResponse);

                            if (!im.ok) {
                                _context5.next = 13;
                                break;
                            }

                            _context5.next = 8;
                            return postMessageToSlack(botAccessToken, im.channel.id, message);

                        case 8:
                            postMessageResponse = _context5.sent;
                            postMessage = JSON.parse(postMessageResponse);

                            if (postMessage.ok) {
                                resolve(postMessage.ts);
                            } else {
                                reject(postMessage.error);
                            }
                            _context5.next = 14;
                            break;

                        case 13:
                            reject(im.error);

                        case 14:
                            _context5.next = 19;
                            break;

                        case 16:
                            _context5.prev = 16;
                            _context5.t0 = _context5['catch'](0);

                            reject(_context5.t0.stack);

                        case 19:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this, [[0, 16]]);
        })).catch(function (err) {
            reject(err.stack);
        });
    });
}
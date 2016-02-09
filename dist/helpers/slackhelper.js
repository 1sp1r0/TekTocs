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
            var slashCommand, team, botAccessToken, slideIndex;
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
                            _context.next = 14;
                            break;

                        case 8:
                            _context.next = 10;
                            return getSlackTeam(slashCommand.team_id);

                        case 10:
                            team = _context.sent;
                            botAccessToken = team.bot.bot_access_token;
                            slideIndex = getNextSlideindex(slashCommand.attachments.slideshow.slides);

                            resolve({ slideText: slideIndex });
                            /*
                            let slide=yield getSlide(message,slideIndex,botAccessToken);
                            if(slide){
                                        slashCommand.attachments.slideshow.slides.push(slide);
                                        yield slashCommand.attachments.slideshow.save();
                                        resolve(slide)
                             }else{
                                 reject("error getting slide data");
                             }*/

                        case 14:
                            _context.next = 19;
                            break;

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context['catch'](0);

                            reject(_context.t0.stack);

                        case 19:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 16]]);
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
    (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
        var slideCaption, slideText, slideAssetUrl;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        slideCaption = '';
                        slideText = '';
                        slideAssetUrl = '';

                        if (!(message.subtype === 'file_share')) {
                            _context2.next = 16;
                            break;
                        }

                        if (message.file.comments_count > 0) {
                            slideCaption = message.file.initial_comment.comment;
                        }

                        if (!(message.file.mode === 'snippet')) {
                            _context2.next = 12;
                            break;
                        }

                        _context2.next = 9;
                        return getSnippetText(message.file.url_private_download, botAccessToken);

                    case 9:
                        slideText = _context2.sent;
                        _context2.next = 13;
                        break;

                    case 12:
                        slideAssetUrl = message.file.url_private_download;

                    case 13:
                        return _context2.abrupt('return', new Models.Slide({
                            slideIndex: slideIndex,
                            slideText: slideText,
                            slideCaption: slideCaption,
                            slideAssetUrl: slideAssetUrl,
                            slideTitle: message.file.title,
                            slideMimeType: message.file.mimetype
                        }));

                    case 16:
                        return _context2.abrupt('return', new Models.Slide({ slideIndex: slideIndex,
                            slideText: message.text,
                            slideCaption: '',
                            slideAssetUrl: '',
                            slideTitle: '',
                            slideMimeType: '' }));

                    case 17:
                        _context2.next = 22;
                        break;

                    case 19:
                        _context2.prev = 19;
                        _context2.t0 = _context2['catch'](0);
                        throw _context2.t0.stack;

                    case 22:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 19]]);
    })).catch(function (err) {
        throw err.stack;
    });
}

function getSlackTeam(teamId) {
    return Models.SlackTeam.findOne({ team_id: teamId }).select('bot.bot_access_token').exec();
}

function getSnippetText(url, botAccessToken) {
    return new Promise(function (resolve, reject) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
            var res;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return (0, _requestPromise2.default)({ headers: { 'Authorization': 'Bearer ' + botAccessToken },
                                url: url });

                        case 3:
                            res = _context3.sent;

                            resolve(res.body);
                            _context3.next = 10;
                            break;

                        case 7:
                            _context3.prev = 7;
                            _context3.t0 = _context3['catch'](0);

                            reject(_context3.t0.stack);

                        case 10:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 7]]);
        })).catch(function (err) {
            reject(err.stack);
        });
    });
}

exports.postMessageToSlack = postMessageToSlack;
exports.openIm = openIm;
exports.processMessage = processMessage;
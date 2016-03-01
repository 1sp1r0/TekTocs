'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.postMessageToSlack = postMessageToSlack;
exports.openIm = openIm;
exports.getUserinfo = getUserinfo;
exports.getImHistory = getImHistory;
exports.processMessage = processMessage;
exports.getSlide = getSlide;
exports.getSlideshowEndingTimestamp = getSlideshowEndingTimestamp;
exports.getUserSlideshow = getUserSlideshow;
exports.getCoverSlide = getCoverSlide;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _models = require('../models/');

var Models = _interopRequireWildcard(_models);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

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

function getImHistory(token, channel, oldest, latest, count) {
    return (0, _requestPromise2.default)({
        url: 'https://slack.com/api/im.history',
        qs: {
            "token": token,
            "channel": channel,
            "oldest": oldest,
            "latest": latest,
            "count": count
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
                            return getSlide(message, slideIndex, botAccessToken, slashCommand.attachments.slideshow.short_id);

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

function getSlide(message, slideIndex, botAccessToken, slideshowId) {
    return new Promise(function (resolve, reject) {

        (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
            var slideCaption, slideText, slideAssetUrl, slideMode, body;
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
                                _context2.next = 25;
                                break;
                            }

                            slideMode = message.file.mode;
                            slideAssetUrl = message.file.url_private_download;
                            if (message.file.comments_count > 0) {
                                slideCaption = message.file.initial_comment.comment;
                            }

                            if (!(message.file.mode === 'snippet')) {
                                _context2.next = 16;
                                break;
                            }

                            _context2.next = 12;
                            return getSnippetText(message.file.url_private_download, botAccessToken);

                        case 12:
                            slideText = _context2.sent;

                            slideAssetUrl = '';

                            _context2.next = 22;
                            break;

                        case 16:
                            _context2.next = 18;
                            return getSlideAsset(slideAssetUrl, botAccessToken);

                        case 18:
                            body = _context2.sent;
                            _context2.next = 21;
                            return saveImageToS3(body, 'public/' + slideshowId + '/' + message.file.name);

                        case 21:
                            slideAssetUrl = _context2.sent;

                        case 22:
                            resolve(new Models.Slide({
                                slideIndex: slideIndex,
                                slideText: slideText,
                                slideCaption: slideCaption,
                                slideAssetUrl: slideAssetUrl,
                                slideTitle: message.file.title,
                                slideMimeType: message.file.mimetype,
                                slideMode: slideMode
                            }));
                            _context2.next = 26;
                            break;

                        case 25:
                            resolve(new Models.Slide({ slideIndex: slideIndex,
                                slideText: message.text,
                                slideCaption: '',
                                slideAssetUrl: '',
                                slideTitle: '',
                                slideMimeType: '',
                                slideMode: '' }));

                        case 26:
                            _context2.next = 32;
                            break;

                        case 28:
                            _context2.prev = 28;
                            _context2.t0 = _context2['catch'](0);

                            _logger2.default.log('error', _context2.t0.stack);
                            reject(_context2.t0.stack);

                        case 32:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 28]]);
        })).catch(function (err) {
            _logger2.default.log('error', err.stack);
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
        (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
            var imResponse, im, postMessageResponse, postMessage;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return openIm(botAccessToken, userId);

                        case 3:
                            imResponse = _context3.sent;
                            im = JSON.parse(imResponse);

                            if (!im.ok) {
                                _context3.next = 13;
                                break;
                            }

                            _context3.next = 8;
                            return postMessageToSlack(botAccessToken, im.channel.id, message);

                        case 8:
                            postMessageResponse = _context3.sent;
                            postMessage = JSON.parse(postMessageResponse);

                            if (postMessage.ok) {
                                resolve(postMessage.ts);
                            } else {
                                reject(postMessage.error);
                            }
                            _context3.next = 14;
                            break;

                        case 13:
                            reject(im.error);

                        case 14:
                            _context3.next = 19;
                            break;

                        case 16:
                            _context3.prev = 16;
                            _context3.t0 = _context3['catch'](0);

                            reject(_context3.t0.stack);

                        case 19:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 16]]);
        })).catch(function (err) {
            reject(err.stack);
        });
    });
}

function getUserSlideshow(userid, slideshowid) {
    return new Promise(function (resolve, reject) {
        try {

            (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
                var slideshow;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return Models.SlashCommand.findOne({
                                    'attachments.slideshow.published': true,
                                    'attachments.slideshow.creator': userid,
                                    'attachments.slideshow.short_id': slideshowid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                            case 3:
                                slideshow = _context4.sent;

                                resolve(slideshow);
                                _context4.next = 10;
                                break;

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4['catch'](0);

                                reject(_context4.t0.stack);

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 7]]);
            })).catch(function (err) {
                reject(err.stack);
            });
        } catch (err) {
            reject(err.message);
        }
    });
}

function getCoverSlide(slide, teamId) {
    return new Promise(function (resolve, reject) {
        try {
            (0, _co2.default)(regeneratorRuntime.mark(function _callee5() {
                var slackTeam;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;

                                if (!(slide.slideAssetUrl != '' && slide.slideMode != 'snippet')) {
                                    _context5.next = 8;
                                    break;
                                }

                                _context5.next = 4;
                                return Models.SlackTeam.findOne({ team_id: teamId });

                            case 4:
                                slackTeam = _context5.sent;

                                if (slackTeam) {
                                    (0, _requestPromise2.default)({ headers: { 'Authorization': 'Bearer ' + slackTeam.bot.bot_access_token }, encoding: null, url: slide.slideAssetUrl }).then(function (res) {
                                        resolve({ isImage: true, base64: res.toString('base64') });
                                    }, function (error) {
                                        _logger2.default.log('error', error);
                                        reject(error);
                                    });
                                } else {
                                    _logger2.default.log('error', 'Could not find a record for team_id:' + teamId);
                                    reject('Could not find a record for team_id:' + teamId);
                                }

                                _context5.next = 9;
                                break;

                            case 8:
                                resolve({ isImage: false, text: slide.slideText });

                            case 9:
                                _context5.next = 14;
                                break;

                            case 11:
                                _context5.prev = 11;
                                _context5.t0 = _context5['catch'](0);

                                reject(_context5.t0.stack);

                            case 14:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 11]]);
            })).catch(function (err) {
                reject(err.stack);
            });
        } catch (err) {
            _logger2.default.log('error', err.message);
            reject(err.message);
        }
    });
}

function getSlideAsset(assetUrl, botAccessToken) {

    return new Promise(function (resolve, reject) {
        (0, _requestPromise2.default)({ headers: { 'Authorization': 'Bearer ' + botAccessToken },
            encoding: null, url: assetUrl }).then(function (res) {
            resolve(res);
        }, function (error) {
            _logger2.default.log('error', error);
            reject(error);
        });
    });
}

function saveImageToS3(body, path) {

    return new Promise(function (resolve, reject) {
        var s3 = new _awsSdk2.default.S3();
        s3.putObject({
            Body: body,
            Key: path,
            Bucket: process.env.AWS_BUCKET_NAME
        }, function (err, data) {
            if (err) {
                _logger2.default.log('error', err);
                reject(err);
            } else {
                resolve(process.env.AWS_S3_URL + '/' + process.env.AWS_BUCKET_NAME + '/' + path);
            }
        });
    });
}
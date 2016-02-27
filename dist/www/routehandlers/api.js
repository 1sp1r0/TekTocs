'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserSlideshow = getUserSlideshow;
exports.getUserSlideshows = getUserSlideshows;
exports.getUser = getUser;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _slackhelper = require('../../helpers/slackhelper');

var slackhelper = _interopRequireWildcard(_slackhelper);

var _models = require('../../models/');

var Models = _interopRequireWildcard(_models);

require('babel-polyfill');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUserSlideshow(req, res) {
    try {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
            var userid, slideshowid, slashCommand, name, coverSlide, slide, mimeType;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            userid = req.params.userid;
                            slideshowid = req.params.slideshowid;
                            _context.next = 5;
                            return Models.SlashCommand.findOne({
                                'attachments.slideshow.published': true,
                                'attachments.slideshow.creator': userid,
                                'attachments.slideshow.short_id': slideshowid }, { createDate: 1, team_id: 1, 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                        case 5:
                            slashCommand = _context.sent;

                            if (slashCommand.attachments) {
                                name = slashCommand.attachments.slideshow.creator.real_name ? slashCommand.attachments.slideshow.creator.real_name : slashCommand.attachments.slideshow.creator.name ? slashCommand.attachments.slideshow.creator.name : '';

                                if (slashCommand.attachments.slideshow.slides.length > 0) {
                                    coverSlide = {};
                                    slide = slashCommand.attachments.slideshow.slides[0];
                                    mimeType = slide.slideMimeType;

                                    if (slide.slideAssetUrl != '' && slide.slideMode != 'snippet') {
                                        coverSlide = { isImage: true, src: slide.slideAssetUrl };
                                    } else {
                                        coverSlide = { isImage: false, text: slide.slideText };
                                    }

                                    // let coverSlide= yield slackhelper.getCoverSlide(
                                    //    slashCommand.attachments.slideshow.slides[0],slashCommand.team_id);

                                    res.status(200).send({ name: name, coverslide: coverSlide, mimeType: mimeType,
                                        createDateText: 'created ' + (0, _moment2.default)(slashCommand.createDate).fromNow(),
                                        slideshow: { title: slashCommand.attachments.slideshow.title,
                                            slides: slashCommand.attachments.slideshow.slides,
                                            creator: slashCommand.attachments.slideshow.creator } });
                                }
                            } else {
                                res.status(500).send('no data');
                            }
                            _context.next = 13;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](0);

                            _logger2.default.log('error', _context.t0.stack);
                            res.sendStatus(500);

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 9]]);
        })).catch(function (err) {
            _logger2.default.log('error', err.stack);
            res.sendStatus(500);
        });
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function getUserSlideshows(req, res) {

    try {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
            var _userid, slashCommands, result;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _userid = req.params.userid;
                            _context2.next = 4;
                            return Models.SlashCommand.find({
                                'attachments.slideshow.published': true,
                                'attachments.slideshow.creator': _userid }, { createDate: 1, team_id: 1, 'attachments.slideshow': 1 }, { sort: { createDate: -1 }, skip: req.query.skip, limit: 15 }).populate('attachments.slideshow.creator').exec();

                        case 4:
                            slashCommands = _context2.sent;

                            if (slashCommands && slashCommands.length > 0) {
                                result = slashCommands.map(function (slashCommand) {
                                    var coverSlide = {};
                                    var name = '';
                                    if (slashCommand.attachments) {
                                        name = slashCommand.attachments.slideshow.creator.real_name ? slashCommand.attachments.slideshow.creator.real_name : slashCommand.attachments.slideshow.creator.name ? slashCommand.attachments.slideshow.creator.name : '';
                                        if (slashCommand.attachments.slideshow.slides.length > 0) {
                                            var _slide = slashCommand.attachments.slideshow.slides[0];
                                            if (_slide.slideAssetUrl != '' && _slide.slideMode != 'snippet') {
                                                coverSlide = { isImage: true, src: _slide.slideAssetUrl };
                                            } else {
                                                coverSlide = { isImage: false, src: '' };
                                            }
                                        }
                                    }

                                    return { name: name, coverslide: coverSlide,
                                        createDateText: 'created ' + (0, _moment2.default)(slashCommand.createDate).fromNow(),
                                        slideshow: { title: slashCommand.attachments.slideshow.title,
                                            slideCount: slashCommand.attachments.slideshow.length,
                                            short_id: slashCommand.attachments.slideshow.short_id,
                                            creator: { _id: slashCommand.attachments.slideshow.creator._id,
                                                image_32: slashCommand.attachments.slideshow.creator.image_32 } } };
                                });

                                res.status(200).send({ ok: true, result: result });
                            } else {
                                res.status(200).send({ ok: false, result: [] });
                            }

                            _context2.next = 12;
                            break;

                        case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2['catch'](0);

                            _logger2.default.log('error', _context2.t0.stack);
                            res.sendStatus(500);

                        case 12:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 8]]);
        })).catch(function (err) {
            _logger2.default.log('error', err.stack);
            res.sendStatus(500);
        });
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}

function getUser(req, res) {

    try {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
            var _userid2, slackUser, _name;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _userid2 = req.params.userid;
                            _context3.next = 4;
                            return Models.SlackUser.findOne({
                                _id: _userid2 }).exec();

                        case 4:
                            slackUser = _context3.sent;

                            if (slackUser) {
                                _name = slackUser.real_name ? slackUser.real_name : slackUser.name ? slackUser.name : '';

                                res.status(200).send({ ok: true, result: { name: _name,
                                        image: slackUser.image_72, description: '' } });
                            } else {
                                res.status(200).send({ ok: false, result: null });
                            }
                            _context3.next = 12;
                            break;

                        case 8:
                            _context3.prev = 8;
                            _context3.t0 = _context3['catch'](0);

                            _logger2.default.log('error', _context3.t0.stack);
                            res.sendStatus(500);

                        case 12:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 8]]);
        })).catch(function (err) {
            _logger2.default.log('error', err.stack);
            res.sendStatus(500);
        });
    } catch (err) {
        _logger2.default.log('error', err.message);
        res.sendStatus(500);
    }
}
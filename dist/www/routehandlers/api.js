'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserSlideshow = getUserSlideshow;
exports.getUserSlideshows = getUserSlideshows;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _models = require('../../models/');

var Models = _interopRequireWildcard(_models);

require('babel-polyfill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUserSlideshow(req, res) {
    try {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
            var userid, slideshowid, slideshow;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            userid = req.params.user;
                            slideshowid = req.params.slideshow;
                            _context.next = 5;
                            return Models.SlashCommand.findOne({
                                'attachments.slideshow.published': true,
                                'attachments.slideshow.creator': userid,
                                'attachments.slideshow.short_id': slideshowid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                        case 5:
                            slideshow = _context.sent;

                            res.status(200).send(slideshow);
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
            var _userid, slideshows;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _userid = req.params.user;
                            _context2.next = 4;
                            return Models.SlashCommand.find({
                                'attachments.slideshow.published': true,
                                'attachments.slideshow.creator': _userid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                        case 4:
                            slideshows = _context2.sent;

                            res.status(200).send(slideshows);
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
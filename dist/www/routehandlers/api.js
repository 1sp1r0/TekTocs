'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserSlideshow = getUserSlideshow;

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
            var userid, slideshowid, slashCommand;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            userid = req.params.user;
                            slideshowid = req.params.slideshow;
                            _context.next = 5;
                            return Models.SlashCommand.findOne({
                                'attachments.slideshow.creator': userid,
                                'attachments.slideshow.short_id': slideshowid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                        case 5:
                            slashCommand = _context.sent;

                            res.status(200).send(slashCommand);
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
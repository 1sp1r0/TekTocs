'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _models = require('../../models/');

var Models = _interopRequireWildcard(_models);

require('babel-polyfill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import $ from 'jquery';

var Slideshow = function (_React$Component) {
  _inherits(Slideshow, _React$Component);

  function Slideshow(props) {
    _classCallCheck(this, Slideshow);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Slideshow).call(this, props));

    _this.state = { data: {} };
    return _this;
  }

  _createClass(Slideshow, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var result = getUserSlideshow();
      if (result.ok) {
        this.setState({ data: result.data });
      }
      /*$.ajax({
        url: 'https://tektocs.herokuapp.com/api/' + self.props.userid + '/' + self.props.slideshowid, //this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          self.setState({data: data});
        },
        error: function(xhr, status, err) {
          console.error(self.props.url, status, err.toString());
        }
      });*/
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'commentBox' },
        _react2.default.createElement(
          'h1',
          null,
          'Hello'
        )
      );
    }
  }, {
    key: 'getUserSlideshow',
    value: function getUserSlideshow() {
      try {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
          var userid, slideshowid, slideshow;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  userid = this.props.userid;
                  slideshowid = this.props.slideshowid;
                  _context.next = 5;
                  return Models.SlashCommand.findOne({
                    'attachments.slideshow.published': true,
                    'attachments.slideshow.creator': userid,
                    'attachments.slideshow.short_id': slideshowid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

                case 5:
                  slideshow = _context.sent;
                  return _context.abrupt('return', { ok: true, data: slideshow });

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context['catch'](0);

                  _logger2.default.log('error', _context.t0.stack);
                  return _context.abrupt('return', { ok: false });

                case 13:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 9]]);
        })).catch(function (err) {
          _logger2.default.log('error', err.stack);
          return { ok: false };
        });
      } catch (err) {
        _logger2.default.log('error', err.message);
        return { ok: false };
      }
    }
  }]);

  return Slideshow;
}(_react2.default.Component);

exports.default = Slideshow;
;
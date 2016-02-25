'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlideshowLead = exports.SlideshowList = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SlideshowList = exports.SlideshowList = function (_React$Component) {
    _inherits(SlideshowList, _React$Component);

    function SlideshowList(props) {
        _classCallCheck(this, SlideshowList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SlideshowList).call(this, props));

        _this.state = { data: { ok: false } };
        return _this;
    }

    _createClass(SlideshowList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {

            var self = this;

            $.ajax({
                url: 'https://tektocs.herokuapp.com/api/' + self.props.userid, //this.props.url,
                dataType: 'json',
                cache: false,
                success: function success(data) {
                    self.setState({ data: data });
                },
                error: function error(xhr, status, err) {
                    console.error(self.props.url, status, err.toString());
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.data.ok) {
                var slideshows = '';
                if (this.state.data.result.length > 0) {
                    var self = this;
                    slideshows = this.state.data.result.map(function (data, index) {
                        return _react2.default.createElement(SlideshowLead, { data: data, key: data.slideshow.short_id });
                    });
                    return _react2.default.createElement(
                        'div',
                        null,
                        slideshows
                    );
                } else {
                    return _react2.default.createElement('div', null);
                }
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }]);

    return SlideshowList;
}(_react2.default.Component);

var SlideshowLead = exports.SlideshowLead = function (_React$Component2) {
    _inherits(SlideshowLead, _React$Component2);

    function SlideshowLead(props) {
        _classCallCheck(this, SlideshowLead);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SlideshowLead).call(this, props));

        _this2.state = { data: {} };
        return _this2;
    }

    _createClass(SlideshowLead, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ data: { coverslide: null, slideshow: null } });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ data: this.props.data });
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.data && this.state.data.coverslide && this.state.data.slideshow) {

                var coverSlide = _react2.default.createElement('div', null);
                if (this.state.data.coverslide.isImage) {
                    if (this.state.data.coverslide.src) {
                        coverSlide = _react2.default.createElement(
                            'div',
                            { className: 'jumbotron-photo' },
                            _react2.default.createElement('img', { src: this.state.data.coverslide.src })
                        );
                    }
                }

                return _react2.default.createElement(
                    'div',
                    { className: 'jumbotron' },
                    _react2.default.createElement(
                        'div',
                        { className: 'jumbotron-contents' },
                        _react2.default.createElement(
                            'div',
                            { className: 'row' },
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-12 col-sm-12 col-xs-12' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'floatLeft' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'avatar-container' },
                                        _react2.default.createElement(
                                            'a',
                                            { className: 'avatar' },
                                            _react2.default.createElement('img', { className: 'avatar-image', src: this.state.data.slideshow.creator.image_32 })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'userinfo' },
                                        _react2.default.createElement(
                                            'a',
                                            null,
                                            this.state.data.name
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'userinfo-extra' },
                                            this.state.data.createDateText + '-' + this.state.data.slideshow.slideCount + ' slides'
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            null,
                            coverSlide
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'slideshow-lead-title' },
                            this.state.data.slideshow.title
                        )
                    )
                );
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }]);

    return SlideshowLead;
}(_react2.default.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            this.setState({ data: { name: '',
                    coverslide: { isImage: true },
                    'mimeType': 'image/jpeg', createDateText: '',
                    slideshow: { title: '', creator: { image_32: '' }, slides: [], slideCaption: '' }
                } });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {

            var self = this;
            $.ajax({
                url: 'https://tektocs.herokuapp.com/api/users/' + self.props.userid + '/slideshows/' + self.props.slideshowid, //this.props.url,
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
        key: 'createMarkup',
        value: function createMarkup(slideText) {
            return { __html: slideText.replace(/\r\n/g, '<br/>') };
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.data.slideshow) {

                var coverSlide = _react2.default.createElement('div', { className: 'tux-loading-indicator text-center' });
                var slides = '';

                if (this.state.data.slideshow.slides.length > 0) {
                    var self = this;
                    slides = this.state.data.slideshow.slides.map(function (slide, index) {

                        if (slide.slideAssetUrl != '' && slide.slideMode != 'snippet') {

                            return _react2.default.createElement(
                                'div',
                                { key: slide._id, className: (index === 0 ? 'active' : '') + ' item' },
                                _react2.default.createElement('img', { src: slide.slideAssetUrl }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slide' },
                                    slide.slideCaption
                                )
                            );
                        } else {
                            if (slide.slideMode === 'snippet') {
                                return _react2.default.createElement(
                                    'div',
                                    { key: slide._id, className: (index === 0 ? 'active' : '') + ' item slideContainer' },
                                    _react2.default.createElement('div', { dangerouslySetInnerHTML: self.createMarkup(slide.slideText), className: 'slide text-left' })
                                );
                            } else {
                                return _react2.default.createElement(
                                    'div',
                                    { key: slide._id, className: (index === 0 ? 'active' : '') + ' item slideContainer' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'slide' },
                                        slide.slideText
                                    )
                                );
                            }
                        }
                    });
                }

                if (this.state.data.coverslide.isImage) {
                    if (this.state.data.coverslide.src) {
                        coverSlide = _react2.default.createElement(
                            'div',
                            { className: 'item active' },
                            _react2.default.createElement('img', { src: this.state.data.coverslide.src })
                        );
                    }
                } else {
                    coverSlide = _react2.default.createElement(
                        'div',
                        { className: 'item active slideContainer' },
                        _react2.default.createElement(
                            'div',
                            { className: 'slide' },
                            this.state.data.coverslide.text
                        )
                    );
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
                                            { href: '/slideshows/' + this.props.userid },
                                            this.state.data.name
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'userinfo-extra' },
                                            this.state.data.createDateText
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-12 col-sm-12 col-xs-12' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-title' },
                                    this.state.data.slideshow.title
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row visible-xs' },
                            _react2.default.createElement(
                                'div',
                                { className: 'col-xs-2' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-left' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'left pull-left', href: '#slideshow-carousel', role: 'button', 'data-slide': 'prev' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-left', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Previous'
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement('div', { className: 'col-xs-8' }),
                            _react2.default.createElement(
                                'div',
                                { className: 'col-xs-2' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-right' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'right pull-right', href: '#slideshow-carousel', role: 'button', 'data-slide': 'next' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-right', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Next'
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row' },
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-1 col-sm-1 hidden-xs' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-left' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'left pull-left', href: '#slideshow-carousel', role: 'button', 'data-slide': 'prev' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-left', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Previous'
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-10 col-sm-10 col-xs-12 text-center' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'carousel', id: 'slideshow-carousel' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'carousel-inner', role: 'listbox' },
                                        slides
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-1 col-sm-1 hidden-xs' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-right' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'right pull-right', href: '#slideshow-carousel', role: 'button', 'data-slide': 'next' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-right', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Next'
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row visible-xs' },
                            _react2.default.createElement(
                                'div',
                                { className: 'col-xs-2' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-left' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'left pull-left', href: '#slideshow-carousel', role: 'button', 'data-slide': 'prev' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-left', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Previous'
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement('div', { className: 'col-xs-8' }),
                            _react2.default.createElement(
                                'div',
                                { className: 'col-xs-2' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'slideshow-nav-button-right' },
                                    _react2.default.createElement(
                                        'a',
                                        { className: 'right pull-right', href: '#slideshow-carousel', role: 'button', 'data-slide': 'next' },
                                        _react2.default.createElement('span', { className: 'glyphicon glyphicon-chevron-right', 'aria-hidden': 'true' }),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'sr-only' },
                                            'Next'
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }]);

    return Slideshow;
}(_react2.default.Component);

exports.default = Slideshow;
;
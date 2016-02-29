'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlideshowLead = exports.SlideshowList = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactInfinite = require('react-infinite');

var _reactInfinite2 = _interopRequireDefault(_reactInfinite);

var _reactWaypoint = require('react-waypoint');

var _reactWaypoint2 = _interopRequireDefault(_reactWaypoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pageSize = 15;

var SlideshowList = exports.SlideshowList = function (_React$Component) {
    _inherits(SlideshowList, _React$Component);

    function SlideshowList(props) {
        _classCallCheck(this, SlideshowList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SlideshowList).call(this, props));

        _this.state = {
            data: { ok: false, result: [] },
            isInitialLoad: true,
            skip: -1 * pageSize
        };
        return _this;
    }

    //componentWillMount(){
    //    this.setState({ok:true,result:[]});
    //}

    _createClass(SlideshowList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getSlideShows();
        }
    }, {
        key: 'renderWaypoint',
        value: function renderWaypoint() {
            //if (this.state.isInitialLoad) {
            //  this.state.isInitialLoad=false;

            return _react2.default.createElement(_reactWaypoint2.default, {
                onEnter: this.getSlideShows.bind(this),
                threshold: 2.0
            });
            //}
        }
    }, {
        key: 'getSlideShows',
        value: function getSlideShows() {

            /* if(this.state.noMoreRecords){
                 return;
             }
             this.state.isInfiniteLoading= true;*/

            this.state.skip = this.state.skip + pageSize;
            var self = this;

            $.ajax({
                url: 'https://tektocs.herokuapp.com/api/users/' + self.props.userid + '/slideshows?skip=' + self.state.skip, //this.props.url,
                dataType: 'json',
                cache: false,
                success: function success(data) {

                    if (data.ok && data.result.length > 0) {
                        //self.state.noMoreRecords=true;
                        data.result = self.state.data.result.concat(data.result);
                        self.setState({ data: data });
                    }
                },
                error: function error(xhr, status, err) {
                    console.error(self.props.url, status, err.toString());
                }
            });
        }
    }, {
        key: 'elementInfiniteLoad',
        value: function elementInfiniteLoad() {
            return _react2.default.createElement(
                'div',
                null,
                'Loading...'
            );
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.data.ok) {
                var slideshows = _react2.default.createElement('div', null);
                // if(this.state.data.result.length>0){
                var self = this;
                slideshows = this.state.data.result.map(function (data, index) {
                    return _react2.default.createElement(SlideshowLead, { userid: self.props.userid, data: data, key: data.slideshow.short_id });
                });
                return _react2.default.createElement(
                    'div',
                    null,
                    slideshows,
                    this.renderWaypoint()
                );
                /*return <Infinite  elementHeight={200}
                        infiniteLoadBeginEdgeOffset={200}
                        onInfiniteLoad={this.getSlideShows.bind(this)}
                        loadingSpinnerDelegate={this.elementInfiniteLoad()}
                        isInfiniteLoading={this.state.isInfiniteLoading} 
                        useWindowAsScrollContainer={true}
                        >
                           {slideshows}
                        </Infinite>   */
                // }
                // else {
                //     return <div></div>;
                // }
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
            //this.setState();
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.props.data && this.props.data.coverslide && this.props.data.slideshow) {

                var coverSlide = _react2.default.createElement('div', null);
                if (this.props.data.coverslide.isImage) {
                    if (this.props.data.coverslide.src) {
                        coverSlide = _react2.default.createElement(
                            'a',
                            { href: '/slideshows/' + this.props.userid + '/' + this.props.data.slideshow.short_id },
                            _react2.default.createElement(
                                'div',
                                { className: 'jumbotron-photo' },
                                _react2.default.createElement('img', { src: this.props.data.coverslide.src })
                            )
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
                                            _react2.default.createElement('img', { className: 'avatar-image', src: this.props.data.slideshow.creator.image_32 })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'userinfo' },
                                        _react2.default.createElement(
                                            'a',
                                            { href: '/slideshows/' + this.props.userid },
                                            this.props.data.name
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'userinfo-extra' },
                                            this.props.data.createDateText + '-' + this.props.data.slideshow.slideCount
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
                            'a',
                            { href: '/slideshows/' + this.props.userid + '/' + this.props.data.slideshow.short_id, className: 'slideshow-lead-title' },
                            this.props.data.slideshow.title
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
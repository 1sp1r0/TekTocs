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

var SlackUser = function (_React$Component) {
    _inherits(SlackUser, _React$Component);

    function SlackUser(props) {
        _classCallCheck(this, SlackUser);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SlackUser).call(this, props));

        _this.state = { data: {} };
        return _this;
    }

    _createClass(SlackUser, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ data: { ok: false, result: { name: '', image: '', description: '' } } });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;

            $.ajax({
                url: 'https://tektocs.herokuapp.com/api/users/' + self.props.userid,
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

                return _react2.default.createElement(
                    'div',
                    { className: 'jumbotron' },
                    _react2.default.createElement(
                        'div',
                        { className: 'jumbotron-contents bs-sidebar affix', id: 'sidebar' },
                        _react2.default.createElement(
                            'div',
                            { className: 'avatar-container' },
                            _react2.default.createElement(
                                'a',
                                { className: 'avatar' },
                                _react2.default.createElement('img', { className: 'avatar-image', src: this.state.data.result.image })
                            )
                        ),
                        _react2.default.createElement(
                            'h3',
                            null,
                            this.state.data.result.name
                        )
                    )
                );
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }]);

    return SlackUser;
}(_react2.default.Component);

exports.default = SlackUser;
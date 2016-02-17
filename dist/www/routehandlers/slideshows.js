'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userSlideshow = exports.userSlideshows = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _slideshow = require('../../components/slideshow.jsx');

var _slideshow2 = _interopRequireDefault(_slideshow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function userSlideshows(req, res) {
    res.render('slideshows/user', { userid: req.params.userid });
}

function userSlideshow(req, res) {
    var SlideShowComponent = _react2.default.createFactory(_slideshow2.default);
    res.render('slideshows/slideshow', {
        react: 'Hello'
    });
}

exports.userSlideshows = userSlideshows;
exports.userSlideshow = userSlideshow;
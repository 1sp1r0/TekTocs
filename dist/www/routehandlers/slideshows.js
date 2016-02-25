'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userSlideshow = exports.userSlideshows = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _slideshow = require('../../components/slideshow');

var _slideshow2 = _interopRequireDefault(_slideshow);

var _slideshowlist = require('../../components/slideshowlist');

var Components = _interopRequireWildcard(_slideshowlist);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function userSlideshows(req, res) {
    var SlideshowListComponent = _react2.default.createFactory(Components.SlideshowList);
    res.render('slideshows/user', { userid: req.params.userid,
        react: _server2.default.renderToString(SlideshowListComponent({ userid: req.params.userid }))
    });
}

function userSlideshow(req, res) {
    var SlideShowComponent = _react2.default.createFactory(_slideshow2.default);
    //res.render('slideshows/slideshow',{userid: req.params.userid,
    //slideshowid:req.params.slideshowid});

    res.render('slideshows/slideshow', { userid: req.params.userid, slideshowid: req.params.slideshowid,
        react: _server2.default.renderToString(SlideShowComponent({ userid: req.params.userid,
            slideshowid: req.params.slideshowid }))
    });
}

exports.userSlideshows = userSlideshows;
exports.userSlideshow = userSlideshow;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function userSlideshows(req, res) {
    res.render('slideshows/user', { userid: req.params.userid });
}

function userSlideshow(req, res) {
    res.render('slideshows/slideshow', { userid: req.params.userid, slideshowid: req.params.slideshowid });
}

exports.userSlideshows = userSlideshows;
exports.userSlideshow = userSlideshow;
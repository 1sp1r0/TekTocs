'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function userSlideshows(req, res) {
    res.render('slideshows/user', { team: req.params.team, user: req.params.user });
}

function userSlideshow(req, res) {
    res.render('slideshows/slideshow', { team: req.params.team, user: req.params.user, slideshow: req.params.slideshow });
}

exports.userSlideshows = userSlideshows;
exports.userSlideshow = userSlideshow;
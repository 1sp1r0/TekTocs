'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function index(req, res) {
    console.log(req.app.slackbot.slack);
    res.render('index', {});
}

exports.index = index;
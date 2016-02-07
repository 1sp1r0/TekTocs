'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function index(req, res) {
    //console.log(req.app.slackbot);
    res.render('index', {});
}

exports.index = index;
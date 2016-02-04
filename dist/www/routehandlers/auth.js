'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.slackoauth = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function slackoauth(req, res) {
    if (!req.body.error) {
        if (req.body.code) {
            (0, _request2.default)('https://slack.com/api/oauth.access', function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    try {
                        _logger2.default.log('info', body);
                        //res.send(body);
                        //res.send(JSON.parse(body));
                        //res.send(JSON.stringify(body));
                        //res.send(body.access_token);
                        //res.send(JSON.parse(body).access_token);
                    } catch (err) {
                        _logger2.default.log('error', err);
                    }
                }
            });
        }
    } else {
        _logger2.default.log('error', req.body.error);
    }
}

exports.slackoauth = slackoauth;
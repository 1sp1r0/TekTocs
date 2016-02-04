'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.slackoauth = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function slackoauth(req, res) {
    var querystring = _url2.default.parse(req.url, true).query;

    if (querystring.code) {

        (0, _request2.default)('https://slack.com/api/oauth.access?client_id=2605154976.20361890802&client_secret=5467921f878c4f13496d11b41623a221&code=' + querystring.code, function (error, response, body) {

            res.send(body);
            return;
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
}

exports.slackoauth = slackoauth;
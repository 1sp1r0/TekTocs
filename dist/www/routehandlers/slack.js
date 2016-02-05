'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oauth = oauth;
exports.command = command;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _slackteam = require('../../models/slackteam.js');

var _slackteam2 = _interopRequireDefault(_slackteam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function oauth(req, res) {
    var querystring = _url2.default.parse(req.url, true).query;

    if (querystring.code) {

        (0, _request2.default)('https://slack.com/api/oauth.access?client_id=2605154976.20361890802&client_secret=5467921f878c4f13496d11b41623a221&code=' + querystring.code, function (error, response, body) {
            try {
                if (!error) {

                    var result = JSON.parse(body);

                    if (result.ok) {

                        var slackTeam = new _slackteam2.default({ access_token: result.access_token });
                        res.send(result);
                        return;
                        slackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                            if (err) {
                                _logger2.default.log('error', { err: err, raw: raw });
                            }
                        });

                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                        //{"ok":true,"access_token":"xoxp-18411796983-18412515072-20372759077-03533db7d4","scope":"identify,commands,bot","team_name":"#interiordesigners","team_id":"T0JC3PEUX","bot":{"bot_user_id":"U0LAW84EQ","bot_access_token":"xoxb-20370276500-oiYPAV9nGQA3ic4AKrlJanlS"}}
                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                    } else {
                            _logger2.default.log('error', result.error);
                        }
                } else {
                    _logger2.default.log('error', error);
                }
                res.send(body);
            } catch (err) {
                _logger2.default.log('error', err);
            }
        });
    }
}

function command(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        _logger2.default.log('warn', 'unauthorized slash command access');
    }

    //res.sendStatus(200);
}
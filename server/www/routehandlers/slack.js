import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import GeneratorRunner from '../../generatorRunner'
import url from 'url'
import SlackTeam from '../../models/slackteam.js'
import "babel-polyfill"

export function oauth(req, res) {
    try {
        let querystring = url.parse(req.url, true).query;
        if (querystring.code) {
            co(function* () {
                try {
                    let body = yield request('https://slack.com/api/oauth.access?client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&code=' + querystring.code);
                    let result = JSON.parse(body);
                    if (result.ok) {
                        yield saveSlackAuthToken(result);
                        res.sendStatus(200);
                    } else {
                        winston.log('error', result.error);
                        res.sendStatus(500);
                    }
                } catch (err) {
                    winston.log('error', err.message);
                    res.sendStatus(500);
                }
            }).catch((err) => {
                winston.log('error', err.stack);
                res.sendStatus(500);
            });

        }
    }
    catch (err) {
        res.send(err.message);
        res.sendStatus(500);
    }
}

export function command(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}


function saveSlackAuthToken(result) {
    return new Promise((resolve, reject) => {
        try {
            SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    reject(err);
                } else {
                    //resolve(raw);
                    reject('simulated error');
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
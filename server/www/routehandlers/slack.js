import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
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
                    winston.log('error', err);
                    res.sendStatus(500);
                }
            }).catch((err) => {
                winston.log('error', err.stack);
                res.sendStatus(500);
            });

        }
    }
    catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

export function command(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        co(function* () {
            try{
                let body = yield request('https://slack.com/api/im.open?token=' + process.env.SLACK_BOT_ACCESS_TOKEN + '&user=' + req.body.user_id);
                let result = JSON.parse(body);
                if(result.ok){
                    res.status(200).send('Hello ' + result.channel.id, 200);
                    
                }else{
                    res.status(200).send('Error ' + body, 200);
                }
            }
            catch (err) {
                    winston.log('error', err);
                    res.sendStatus(500);
                }
        }).catch((err) => {
                winston.log('error', err.stack);
                res.sendStatus(500);
            });;
        //function(req,res,body){});
        
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}


function saveSlackAuthToken(result) {
    return new Promise((resolve, reject) => {
        try {
            Models.SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    reject(err);
                } else {
                    resolve(raw);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
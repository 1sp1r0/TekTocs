import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
import "babel-polyfill"
import Slack from 'slack-client'

export function start(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}

export function startLive(req, res) {
    try{
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        co(function* () {
            try {
                let slashCommand = new Models.SlashCommand({team_id:req.body.team_id,
                    team_domain: req.body.team_domain,
                    channel_id:req.body.channel_id,
                    channel_name:req.body.channel_name,
                    user_id:req.body.user_id,
                    user_name:req.body.user_name,
                    command:req.body.command,
                    text:req.body.text,
                    response_url:req.body.response_url,
                    pending:true});
                yield slashCommand.save();
                let slackTeam=yield Models.SlackTeam.findOne({team_id:slashCommand.team_id});
                if(slackTeam){
                    if(req.app.slackbot.slack){
                        //req.app.slackbot.slack.removeSlackListeners();
                        winston.log('info', req.app.slackbot.slack);
                       // req.app.slackbot.slack.disconnect();
                    }
                    req.app.slackbot.slack = new Slack(slackTeam.bot.bot_access_token, true, true);
                    req.app.slackbot.slack.login();
                    req.app.slackbot.removeSlackListeners();
                    req.app.slackbot.registerSlackListeners();
                }
                res.status(200).send('Hello ' + req.body.channel_id, 200);
            }
            catch (err) {
                winston.log('error', err.stack);
                res.sendStatus(500);
            }
        }).catch((err) => {
            winston.log('error', err.stack);
            res.sendStatus(500);
        });;

    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

function saveSlashCommand(result) {
    return new Promise((resolve, reject) => {
        try {
            SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
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
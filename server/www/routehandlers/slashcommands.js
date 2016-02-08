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
                if (req.body.text.trim()===''){
                    res.status(200).send('Every slideshow needs a title. Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"');
                }
                yield saveSlashCommand(req.body);
                let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                if(slackTeam){
                    req.app.slackbot.slack = new Slack(slackTeam.bot.bot_access_token, true, true);
                    req.app.slackbot.slack.login();
                    req.app.slackbot.registerSlackListeners();
                }
                res.status(200).send('A direct message channel has been opened with Tektocs. Every message you post in that channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.', 200);
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

function saveSlashCommand(body) {
    let slashCommand = new Models.SlashCommand({team_id:body.team_id,
                    team_domain: body.team_domain,
                    channel_id:body.channel_id,
                    channel_name:body.channel_name,
                    user_id:body.user_id,
                    user_name:body.user_name,
                    command:body.command,
                    text:body.text,
                    response_url:body.response_url,
                    pending:true});
    return slashCommand.save();                
}
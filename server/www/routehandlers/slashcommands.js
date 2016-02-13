import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
import "babel-polyfill"
import Slack from 'slack-client'
import * as slackhelper from '../../helpers/slackhelper'
import shortid from 'shortid'

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
                    return;
                }
                
                let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                if(slackTeam){
                    if(req.app.slackbot.slack.token !=slackTeam.bot.bot_access_token){
                        req.app.slackbot.slack = new Slack(slackTeam.bot.bot_access_token, true, true);
                        req.app.slackbot.registerSlackListeners();
                    }
                    let imResponse=yield slackhelper.openIm(slackTeam.bot.bot_access_token,req.body.user_id);
                    let im=JSON.parse(imResponse);
                    if(im.ok){
                        let user=yield Models.SlackUser.findOne({user_id:req.body.user_id});
                        
                        if(!user){
                            
                            let userInfoResponse=yield slackhelper.getUserinfo(slackTeam.bot.bot_access_token,req.body.user_id);
                            let userInfo=JSON.parse(userInfoResponse);
                            if(userInfo.ok){
                                user=yield saveSlackUser(userInfo.user);
                            }
                            else{
                                winston.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return;
                            }
                        }
                        if(user){
                            
                            let postMessageResponse=yield slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token,im.channel.id,'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');
                            let postMessage=JSON.parse(postMessageResponse);
                            if(postMessage.ok){
                                yield saveSlashCommand(req.body,im.channel.id,user._id,postMessage.ts);
                                req.app.slackbot.slack.login();
                                res.status(200).send('Got it! Our friendly bot, tektocs, has instructions for you on how to create your slideshow. Check tektoc\'s direct message channel.');
                            }else{
                                winston.log('error', postMessage.error);
                                res.status(500).send('Sorry, we had trouble waking up our bot, Tektocs.');
                              
                            }
                            
                        }else{
                            winston.log('error', 'Could not retrieve user info.');
                            res.status(500).send('Could not retrieve user info.');
                        }
                    }else{
                        winston.log('error', im.error);
                        res.status(500).send('Could not open direct message channel with our bot, tektocs');
                    }
                    
                }
                else{
                    winston.log('error', 'Models.SlackTeam.findOne did not find a record for team_id:' + req.body.team_id + '(' + req.body.team_domain + ')');
                    res.status(500).send('Hmm, something doesn\'t seem to be right. We are looking into this.');
                }
                
                
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

function saveSlashCommand(body,channelId,userid,startTs) {
    
    let slashCommand = new Models.SlashCommand({team_id:body.team_id,
                    team_domain: body.team_domain,
                    channel_id:channelId,
                    user_id:body.user_id,
                    user_name:body.user_name,
                    command:body.command,
                    commandType:(body.command==='/tektocs-start' || body.command==='/tektocs-startlive')?'start':'',
                    text:body.text,
                    response_url:body.response_url,
                    attachments:{
                        slideshow:{
                            start_ts:startTs,
                            title: body.text,
                            short_id:shortid.generate(),
                            creator:userid,
                            slides:[],
                            published:false
                        }
                    },
                    pending:true,
                    createDate:new Date()});
    return slashCommand.save();                
}


function saveSlackUser(userInfo) {
    return new Promise((resolve, reject) => {
        try {
            Models.SlackUser.update({ user_id: userInfo.id }, 
            Object.assign({},userInfo.profile,
            {user_id:userInfo.id,name:userInfo.name,short_id:shortid.generate()}), 
            { upsert: true }, function (err, raw) {
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

 
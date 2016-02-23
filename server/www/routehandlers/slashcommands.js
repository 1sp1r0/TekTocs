import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
import "babel-polyfill"
import Slack from 'slack-client'
import * as slackhelper from '../../helpers/slackhelper'
import shortid from 'shortid'



export function publish(req,res){
    try{
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            co(function* () {
                try{
                    let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                    if(slackTeam){
                     let slashCommand = yield Models.SlashCommand.findOne({ 
                        team_domain: req.body.team_domain, 
                        user_id: req.body.user_id, pending:false,
                        'attachments.slideshow.published':false,
                        commandType:'start' },{channel_id:1,'attachments.slideshow':1},{sort:{createDate: -1}})
                        .exec();
                        if(!slashCommand){
                            winston.log('error','Could not find any unpublished slideshows for:' + req.body.team_domain + ',' +  req.body.user_id);
                            res.status(200).send('Could not find any unpublished slideshows.');
                        }
                        else{
                            let response=yield slackhelper.getImHistory(slackTeam.bot.bot_access_token,
                            slashCommand.channel_id,slashCommand.attachments.slideshow.start_ts,slashCommand.attachments.slideshow.end_ts,1000,null);
                            let msgResponse=JSON.parse(response);
                           
                            if(msgResponse.ok){
                                let messages=msgResponse.messages.reverse();
                                processMessages(messages,slashCommand,slackTeam.bot.bot_access_token);
                                /*let slide = yield slackhelper.getSlide(messages[0], 1,
                            slackTeam.bot.bot_access_token,slashCommand.attachments.slideshow.short_id);
                            if (slide) {
                                slashCommand.attachments.slideshow.slides.push(slide);
                                slashCommand.attachments.slideshow.published = true;
                                yield slashCommand.attachments.slideshow.save();
                            }*/
                                res.status(200).send('Slideshow has been published.');
                            }
                            else{
                                winston.log('error', response.error);
                                res.status(500).send('Could not retrieve messages from the Slack channel.');
                            }
                        }
                    }else{
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
            });
        }else{
            winston.log('warn', 'unauthorized slash command access');
        }
    }
    catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}


function processMessages(messages, slashCommand, botAcessToken) {
    co(function* () {
        try {
            
            let slideIndex = 1;
            messages.forEach(m=> {
                co(function* () {
                    try {
                        let slide = yield slackhelper.getSlide(m, slideIndex,
                            botAcessToken,slashCommand.attachments.slideshow.short_id);
                        if (slide) {
                            slashCommand.attachments.slideshow.slides.push(slide);
                        }
                        slashCommand.attachments.slideshow.published = true;
                        yield slashCommand.attachments.slideshow.save();
                    } catch (err) {
                        winston.log('error', err.stack);

                    }
                }).catch((err) => {
                    winston.log('error', err.stack);

                });
                slideIndex = slideIndex + 1;
            });
            //slashCommand.attachments.slideshow.published = true;
            //yield slashCommand.attachments.slideshow.save();
        }
        catch (err) {
            winston.log('error', err.stack);
        }
    }).catch((err) => {
       winston.log('error', err.stack);

    });
}

export function end(req, res) {
    try
    {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            co(function* () {
                try {
                    let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                    if(slackTeam){
                        let endingTs=yield slackhelper.getSlideshowEndingTimestamp('Your slideshow is now marked as complete. The next step is to publish it using the command /tektocs-publish.',
                        req.body.user_id,slackTeam.bot.bot_access_token);
                        yield Models.SlashCommand.findOneAndUpdate({ 
                        team_domain: req.body.team_domain, 
                        user_id: req.body.user_id, pending:true,
                        commandType:'start' },{pending:false,'attachments.slideshow.end_ts':endingTs},{sort:{createDate: -1}})
                       .exec();
                       res.sendStatus(200);
                    }else{
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
            });
        }
        else {
            winston.log('warn', 'unauthorized slash command access');
        }
    }
    catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}


export function start(req,res){
   startSlideshow(req, res,false);
}

export function startLive(req, res) {
    startSlideshow(req, res,true);
}

export function startSlideshow(req, res,isLive) {
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
                    if(isLive && req.app.slackbot.slack.token !=slackTeam.bot.bot_access_token){
                        req.app.slackbot.slack = new Slack(slackTeam.bot.bot_access_token, true, true);
                        req.app.slackbot.registerSlackListeners();
                    }
                    let imResponse=yield slackhelper.openIm(slackTeam.bot.bot_access_token,req.body.user_id);
                    let im=JSON.parse(imResponse);
                    if(im.ok){
                        let userDbId='';
                        let user=yield Models.SlackUser.findOne({user_id:req.body.user_id});
                        
                        if(!user){
                            
                            let userInfoResponse=yield slackhelper.getUserinfo(slackTeam.bot.bot_access_token,req.body.user_id);
                            let userInfo=JSON.parse(userInfoResponse);
                            if(userInfo.ok){
                                let user=yield saveSlackUser(userInfo.user);
                                userDbId=user.upserted[0]._id;
                            }
                            else{
                                winston.log('error', userInfo.error);
                                res.status(500).send('Could not retrieve user info.');
                                return;
                            }
                        }else{
                            userDbId=user._id;
                        }
                        if(userDbId !=''){
                            let postMessageResponse=yield slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token,im.channel.id,'Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.');
                            let postMessage=JSON.parse(postMessageResponse);
                            if(postMessage.ok){
                                yield saveStartSlashCommand(req.body,im.channel.id,userDbId,postMessage.ts);
                                req.app.slackbot.slack.login();
                                res.status(200).send('You are now ready to add slides to your slideshow. First, change over to our bot, Tektocs\', direct messaging channel. Every message you post in that channel will be a single slide.  Happy creating!');
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
        });

    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

function saveStartSlashCommand(body,channelId,userid,startTs) {
    
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
                            end_ts:'',
                            start_ts:startTs,
                            title: body.text,
                            short_id:shortid.generate(),
                            creator:userid,
                            slides:[],
                            published:false,
                            pending:true
                        }
                    },
                    pending:true,
                    createDate:new Date()});
    return slashCommand.save();                
}


function saveSlackUser(userInfo) {
    return new Promise((resolve, reject) => {
        try {
            let short_id=shortid.generate();
            Models.SlackUser.update({ user_id: userInfo.id }, 
            Object.assign({},userInfo.profile,
            {user_id:userInfo.id,name:userInfo.name,_id:short_id}), 
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

 
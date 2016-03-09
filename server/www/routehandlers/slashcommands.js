import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
import "babel-polyfill"
import Slack from 'slack-client'
import * as slackhelper from '../../helpers/slackhelper'
import tag from '../../helpers/tag'
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
                            winston.log('error',`${tag`noUnpublishedSlideshowsFound`}:${req.body.team_domain},${req.body.user_id}`);
                            res.status(200).send(tag`noUnpublishedSlideshowsFound`);
                        }
                        else{
                            let response=yield slackhelper.getImHistory(slackTeam.bot.bot_access_token,
                            slashCommand.channel_id,slashCommand.attachments.slideshow.start_ts,slashCommand.attachments.slideshow.end_ts,1000,null);
                            let msgResponse=JSON.parse(response);
                           
                            if(msgResponse.ok){
                                let messages=msgResponse.messages.reverse();
                                setImmediate(()=>{
                                    try {
                                        co(function* () {
                                            yield processMessages(messages,slashCommand,slackTeam.bot.bot_access_token);
                                            slashCommand.attachments.slideshow.published = true;
                                            yield slashCommand.attachments.slideshow.save();
                                            }).catch((err) => {
                                                winston.log('error', err.stack);
                                            });
                                    } catch (err) {
                                        winston.log('error', err.stack);
                            
                                    }
                                });
                                res.status(200).send(tag`slideshowHasBeenPublished`);
                            }
                            else{
                                winston.log('error', response.error);
                                res.status(500).send(tag`couldNotretrieveSlackmessage`);
                            }
                        }
                    }else{
                         winston.log('error',`${tag`didNotFindrecord`}:${req.body.team_id}(${req.body.team_domain})`);
                        res.status(500).send(tag`somethingDoesntSeemToBeRight`);
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
            winston.log('warn', tag`unauthorizedSlashCommandAccess`);
        }
    }
    catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}


function processMessages(messages, slashCommand, botAcessToken) {
   
        let slideIndex = 1;
        try {
            return messages.map(m=>{
                return new Promise((resolve,reject)=>{
                    co(function* () {
                    try {
                        let slide = yield slackhelper.getSlide(m, slideIndex++,
                            botAcessToken,slashCommand.attachments.slideshow.short_id);
                        if (slide) {
                            slashCommand.attachments.slideshow.slides.push(slide);
                            resolve(true);
                        }else{
                            reject(tag`couldNotProcessMessageAsSlide`);
                            winston.log('error', tag`couldNotProcessMessageAsSlide`);
                        }
                        
                    } catch (err) {
                        winston.log('error', err.stack);
                        reject(err.stack);    
                    }
                }).catch((err) => {
                    winston.log('error', err.stack);
                    reject(err.stack);    
                });
                });
            });
            
        
        }
        catch (err) {
            winston.log('error', err.stack);
        }
    
}

export function end(req, res) {
    try
    {
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
            co(function* () {
                try {
                    let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                    if(slackTeam){
                        let endingTs=yield slackhelper.getSlideshowEndingTimestamp(tag`slideshowMarkedAsComplete`,
                        req.body.user_id,slackTeam.bot.bot_access_token);
                        yield Models.SlashCommand.findOneAndUpdate({ 
                        team_domain: req.body.team_domain, 
                        user_id: req.body.user_id, pending:true,
                        commandType:'start' },{pending:false,'attachments.slideshow.end_ts':endingTs},{sort:{createDate: -1}})
                       .exec();
                       res.sendStatus(200);
                    }else{
                       winston.log('error',`${tag`didNotFindrecord`}:${req.body.team_id}(${req.body.team_domain})`);
                       res.status(500).send(tag`somethingDoesntSeemToBeRight`);
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
            winston.log('warn', tag`unauthorizedSlashCommandAccess`);
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
                req.app.slackbot.slack=new Slack('', true, true);
                if (req.body.text.trim()===''){
                    res.status(200).send(tag`slideshowRequiresTitle`);
                    return;
                }
                
                let slackTeam=yield Models.SlackTeam.findOne({team_id:req.body.team_id});
                if(slackTeam){
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
                                res.status(500).send(tag`couldNotRetriveUserInfo`);
                                return;
                            }
                        }else{
                            userDbId=user._id;
                        }
                        if(userDbId !=''){
                            let msg=tag`letsGetStartedWithTheSlideshow`;
                            let liveMsg=tag`letsGetStartedWithTheLiveSlideshow`;
                            let postMessageResponse=yield slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token,im.channel.id,isLive?liveMsg:msg);
                            let postMessage=JSON.parse(postMessageResponse);
                            if(postMessage.ok){
                                let savedSlashCommand=yield saveStartSlashCommand(req.body,im.channel.id,userDbId,postMessage.ts,isLive);
                                if(isLive){
                                    yield slackhelper.postMessageToSlack(slackTeam.bot.bot_access_token,im.channel.id,'This is the url where your slideshow will be streaming: https://tektocs.herokuapp.com/slideshows/live/' + savedSlashCommand.attachments.slideshow.creator + '/' + savedSlashCommand.attachments.slideshow.short_id);
                                    if(req.app.slackbot.slack.token !=slackTeam.bot.bot_access_token){
                                        req.app.slackbot.slack = new Slack(slackTeam.bot.bot_access_token, true, true);
                                        //req.app.slackbot.registerSocketIoListeners(req.app.server,req.body.user_id);
                                        req.app.slackbot.registerSlackListeners(savedSlashCommand.attachments.slideshow.creator);
                                    }
                                }
                                req.app.slackbot.slack.login();
                                res.status(200).send(tag`readyToAddSlides`);
                            }else{
                                winston.log('error', postMessage.error);
                                res.status(500).send(tag`troubleWakingUpBot`);
                              
                            }
                            
                        }else{
                            winston.log('error', tag`couldNotRetriveUserInfo`);
                            res.status(500).send(tag`couldNotRetriveUserInfo`);
                        }
                    }else{
                        
                        winston.log('error', im.error);
                        res.status(500).send(tag`couldNotOpenDMChannelWithBot`);
                    }
                    
                }
                else{
                    winston.log('error',`${tag`didNotFindrecord`}:${req.body.team_id}(${req.body.team_domain})`);
                     res.status(500).send(tag`somethingDoesntSeemToBeRight`);
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
        winston.log('warn', tag`unauthorizedSlashCommandAccess`);
    }
}catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

function saveStartSlashCommand(body,channelId,userid,startTs,isLive) {
    
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
                            published:isLive,
                            pending:!isLive
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

 
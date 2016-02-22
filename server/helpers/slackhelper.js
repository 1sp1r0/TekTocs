import request from 'request-promise'
import * as Models from '../models/'
import co from 'co'
import winston from '../logger'
import AWS from 'aws-sdk'




export function postMessageToSlack(token,channel,msg){
         return  request({
                    url: 'https://slack.com/api/chat.postMessage', 
                    qs: {
                        "token": token,
                        "channel": channel,
                        "text":msg,
                        "as_user":true
                        }});
        }
    
export function openIm(token,userId){
         return  request({
                    url: 'https://slack.com/api/im.open', 
                    qs: {
                        "token": token,
                        "user": userId
                        }});
        }
        
export function getUserinfo(token,userId){
         return  request({
                    url: 'https://slack.com/api/users.info', 
                    qs: {
                        "token": token,
                        "user": userId
                        }});
        }  
        
 export function getImHistory(token,channel,oldest,latest,count){
         return  request({
                    url: 'https://slack.com/api/im.history', 
                    qs: {
                        "token": token,
                        "channel": channel,
                        "oldest":oldest,
                        "latest":latest,
                        "count":count
                        }});
        }  
        
        
export function processMessage(message){
    return new Promise((resolve, reject) => {
        co(function* () {
        try {
            //check to see if the user has a pending /tektocs-start or /tektocs-startlive command
            //{ channel_id: 1, user_id: 1, commandType:1 }
            let slashCommand= yield Models.SlashCommand.findOne({ channel_id: message.channel, 
            user_id: message.user, pending:true,
            commandType:'start' }).sort({createDate: -1}).limit(1)
            .select('team_id attachments.slideshow').exec();
            if(!slashCommand){
                reject('Slideshow has not been started yet.');
            }else{
                let team = yield getSlackTeam(slashCommand.team_id);
                let botAccessToken=team.bot.bot_access_token;
                let slideIndex=getNextSlideindex(slashCommand.attachments.slideshow.slides);
                let slide=yield getSlide(message,slideIndex,botAccessToken,slashCommand.slideshow.short_id);
                if(slide){
                            slashCommand.attachments.slideshow.slides.push(slide);
                            yield slashCommand.attachments.slideshow.save();
                            resolve(slide)
                 }else{
                     reject("error getting slide data");
                 }
            }
        }
        catch (err) {
                    reject(err.stack);
                }
        }).catch((err) => {
              reject(err.stack);
            });
    });
}    

 

function getNextSlideindex(slides){
    return slides.length>0?Math.max(...slides.map(slide=>slide.slideIndex)) +1:1;
}  

export function getSlide(message,slideIndex,botAccessToken,slideshowId){
    return new Promise((resolve, reject) => {
     co(function* () {
        try {
            let slideCaption='';
            let slideText='';
            let slideAssetUrl='';
            let slideMode='';
       if (message.subtype==='file_share'){
           slideMode=message.file.mode;
           slideAssetUrl=message.file.url_private_download;
           if(message.file.comments_count >0){
              slideCaption=message.file.initial_comment.comment;
           }
           if(message.file.mode==='snippet'){
                 slideText= yield getSnippetText(message.file.url_private_download,botAccessToken);
           }else{
              let body=yield request({headers: {'Authorization': 'Bearer ' + botAccessToken},encoding:null,url:slideAssetUrl});
              slideAssetUrl=yield saveImageToS3(body,`public/${slideshowId}/${message.file.name}`);
           }
         resolve (new Models.Slide({
             slideIndex:slideIndex,
             slideText:slideText,
             slideCaption:slideCaption,
             slideAssetUrl:slideAssetUrl,
             slideTitle:message.file.title,
             slideMimeType:message.file.mimetype,
             slideMode:slideMode
         }));
     }else{
         resolve(new Models.Slide({slideIndex:slideIndex,
                slideText:message.text,
                slideCaption:'',
                slideAssetUrl:'',
                slideTitle:'',
                slideMimeType:'',
                slideMode:''}));
     }
    }
        catch (err) {
           reject(err.stack);
         }
        }).catch((err) => {
           reject(err.stack);
        });
    });          
}


function getSlackTeam(teamId){
    return Models.SlackTeam.findOne({team_id: teamId}).select('bot.bot_access_token').exec();
}

function getSnippetText(url,botAccessToken){
    return new Promise((resolve, reject) => {
        request({headers: 
            {'Authorization': 'Bearer ' + botAccessToken},
            url:url},function(err,res){
                            if(err){
                                reject(err);
                            }else{
                                resolve(res.body);
                            }
                     });
          
    });
}

export function getSlideshowEndingTimestamp(message,userId,botAccessToken){
    return new Promise((resolve, reject) => {
     co(function* () {
        try {
            let imResponse=yield openIm(botAccessToken,userId);
            let im=JSON.parse(imResponse);
            if(im.ok){
                let postMessageResponse=yield postMessageToSlack(botAccessToken,
                im.channel.id,message);
                let postMessage=JSON.parse(postMessageResponse);
                if(postMessage.ok){
                     resolve(postMessage.ts);
                }else{
                     reject(postMessage.error);
                }
            }else{
                reject(im.error);
            }
        }catch (err) {
           reject(err.stack);
         }
        }).catch((err) => {
           reject(err.stack);
        });
    });   
    
}

export function getUserSlideshow(userid,slideshowid){
    return new Promise((resolve, reject) => {    
    try{
        
        co(function* () {
           try{
                
                let slideshow = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                        resolve(slideshow);
             }catch (err) {
                  reject(err.stack);
             }
       }).catch((err) => {
            reject(err.stack);
      });
    }catch (err) {
        reject(err.message);
    }
    });
}

export function getCoverSlide(slide,teamId){
    return new Promise((resolve, reject) => {    
    try{
        co(function* () {
           try{
         if (slide.slideAssetUrl !='' && slide.slideMode != 'snippet'){
             let slackTeam=yield Models.SlackTeam.findOne({team_id:teamId});
             if(slackTeam){
                 let body=yield request({headers: {'Authorization': 'Bearer ' + slackTeam.bot.bot_access_token},encoding:null,url:slide.slideAssetUrl});
                 let slideAssetUrl=yield saveImageToS3(body,`public/avx1263/asqqs.jpg`);
                 console.log(slideAssetUrl);
                 request({headers: {'Authorization': 'Bearer ' + slackTeam.bot.bot_access_token},encoding:null,url:slide.slideAssetUrl})
                    .then(
                     function(res){
                                resolve({isImage:true,base64:res.toString('base64')});
                     },function(error){
                         winston.log('error', error);
                         reject(error);
                     });
             }else{
                  winston.log('error', 'Could not find a record for team_id:' + teamId );
                  reject('Could not find a record for team_id:' + teamId);
             }
             
          }
          else{
                  resolve({isImage:false,text:slide.slideText});
              }
              }catch (err) {
                  reject(err.stack);
             }
       }).catch((err) => {
            reject(err.stack);
      });
    }catch (err) {
        winston.log('error', err.message);
        reject(err.message);
    }
  });
 }

    
function saveImageToS3(body,path){
   
    return new Promise((resolve, reject) => { 
        let s3 = new AWS.S3(); 
        s3.putObject({
                Body: body,
                Key: path,
                Bucket: process.env.AWS_BUCKET_NAME
            }, function(err, data) {
                if (err) {   
                    winston.log('error', err);   
                    reject(err)   
                }  
                else{
                    resolve(`${process.env.AWS_S3_URL}/${process.env.AWS_BUCKET_NAME}/${path}`);   
                }       
        });
    });
}
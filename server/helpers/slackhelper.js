import request from 'request-promise'
import * as Models from '../models/'
import co from 'co'

function postMessageToSlack(token,channel,msg){
         return  request({
                    url: 'https://slack.com/api/chat.postMessage', 
                    qs: {
                        "token": token,
                        "channel": channel,
                        "text":msg,
                        "as_user":true
                        }});
        }
    
function openIm(token,userId){
         return  request({
                    url: 'https://slack.com/api/im.open', 
                    qs: {
                        "token": token,
                        "user": userId
                        }});
        }
        
function processMessage(message){
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
                let slide=yield getSlide(message,slideIndex,botAccessToken);
                if(slide){
                            //slashCommand.attachments.slideshow.slides.push(slide);
                            //yield slashCommand.attachments.slideshow.save();
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

function getSlide(message,slideIndex,botAccessToken){
    return new Promise((resolve, reject) => {
     co(function* () {
        try {
            let slideCaption='';
            let slideText='';
            let slideAssetUrl='';
       if (message.subtype==='file_share'){
                if(message.file.comments_count >0){
                    slideCaption=message.file.initial_comment.comment;
                }
            if(message.file.mode==='snippet'){
                 slideText= yield getSnippetText(message.file.url_private_download,botAccessToken);
            }else{
                 slideAssetUrl=message.file.url_private_download;
            }
         resolve (new Models.Slide({
             slideIndex:slideIndex,
             slideText:slideText,
             slideCaption:slideCaption,
             slideAssetUrl:slideAssetUrl,
             slideTitle:message.file.title,
             slideMimeType:message.file.mimetype
         }));
     }else{
         resolve(new Models.Slide({slideIndex:slideIndex,
                slideText:message.text,
                slideCaption:'',
                slideAssetUrl:'',
                slideTitle:'',
                slideMimeType:''}));
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
        co(function* () {
        try {
        let res= yield request({headers: 
            {'Authorization': 'Bearer ' + botAccessToken},
            url:url});
          resolve(res.body);  
        }
        catch (err) {
            reject(err.stack);
         }
        }).catch((err) => {
              reject(err.stack);
            });
    });
}
    
export {postMessageToSlack,openIm,processMessage};
import request from 'request-promise'
import * as Models from '../models/'
import co from 'co'

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
        
 function getImHistory(token,channel,oldest,count){
         return  request({
                    url: 'https://slack.com/api/im.history', 
                    qs: {
                        "token": token,
                        "channel": channel,
                        "oldest":oldest,
                        "count":count
                        }});
        }  
        
 export function getMessagesFromSlack(token,channel,startTs,endTs,count,messages){
     
        co(function* (){
            
            try{
                
                if(!messages){
                    messages=[];
                }
                let oldest=startTs;
                let latest=endTs;
                let imHistoryResponse=yield getImHistory(token,channel,oldest,count);
                
                let imHistory=JSON.parse(imHistoryResponse);
                if(imHistory.ok){
                    
                    imHistory.messages.forEach( m=>{
                        if(m.ts !=latest){
                            messages.push(m)
                        }else{
                            return {ok:true,messages:messages};
                        }
                    });
                    if(imHistory.has_more){
                        getMessagesFromSlack(token,channel,messages[messages.length-1].ts,latest,count,messages);
                    }
                }else{
                    return {ok:false,error:imHistory.error};
                }
            }
            catch (err) {
                return {ok:false,error:err.stack};
               
            }
        }).catch((err) => {
            return {ok:false,error:err.stack};
        });
   
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
                let slide=yield getSlide(message,slideIndex,botAccessToken);
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

export function getSlide(message,slideIndex,botAccessToken){
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
    

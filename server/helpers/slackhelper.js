import request from 'request-promise'

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
    
export {postMessageToSlack,openIm};
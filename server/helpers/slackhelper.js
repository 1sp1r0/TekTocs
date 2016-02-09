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
        
function processMessage(message){
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
    
export {postMessageToSlack,openIm,processMessage};
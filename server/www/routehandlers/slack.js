import request from 'request-promise'
import winston from '../../logger'
import url from 'url'
import SlackTeam from '../../models/slackteam.js'


export function oauth (req,res){
    try{
    let querystring = url.parse(req.url,true).query;
      if(querystring.code){
            request('https://slack.com/api/oauth.access?client_id=' + 
                     process.env.SLACK_CLIENT_ID + 
                    '&client_secret=' + process.env.SLACK_CLIENT_SECRET +  
                    '&code='+ querystring.code
                   ).then(getSlackAuthToken,requestErrorHandler);
        }
    }catch (error){
        winston.log('error', error);
    }  
    finally{
        res.sendStatus(200);
    }
}

export function command (req,res){
   if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN){
       res.status(200).send('Hello ' + req.body.user_name,200);
   }else{
       winston.log('warn','unauthorized slash command access');
   }
   
    //res.sendStatus(200);
}


function requestErrorHandler(error){
    winston.log('error', error);
    
}

function getSlackAuthToken(body) {
    try {
        let result = JSON.parse(body);
        if (result.ok) {
            SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    winston.log('error', { err: err, raw: raw });
                }
            });
        } else {
            winston.log('error', result.error);
        }
    }
    catch (err) {
        winston.log('error', err);
    }
}
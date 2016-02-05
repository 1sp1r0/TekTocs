import request from 'request'
import winston from '../../logger'
import url from 'url'
import {SlackTeam} from '../../models/exports.js'


export function oauth (req,res){
    let querystring = url.parse(req.url,true).query;
  
        if(querystring.code){
           
            request('https://slack.com/api/oauth.access?client_id=2605154976.20361890802&client_secret=5467921f878c4f13496d11b41623a221&code='+ querystring.code,
            function(error, response, body){
                try{
                if(!error){
                    
                    let result=JSON.parse(body);
                    res.send(result);
                    return;
                    if(result.ok){
                        let slackTeam=new SlackTeam(result);
                        slackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                        if (err) {
                            winston.log('error', {err:err,raw:raw});
                            }
                        });
                        
                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                        //{"ok":true,"access_token":"xoxp-18411796983-18412515072-20372759077-03533db7d4","scope":"identify,commands,bot","team_name":"#interiordesigners","team_id":"T0JC3PEUX","bot":{"bot_user_id":"U0LAW84EQ","bot_access_token":"xoxb-20370276500-oiYPAV9nGQA3ic4AKrlJanlS"}}
                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                        //{"ok":true,"access_token":"xoxp-2605154976-2605154980-20366174116-297e0ed68c","scope":"identify,commands,bot","team_name":"obvuis","team_id":"T02HT4JUQ","bot":{"bot_user_id":"U0LAYGPLP","bot_access_token":"xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i"}}
                    }else{
                        winston.log('error',result.error);   
                    }
                }else{
                    winston.log('error',error);
                }
                res.send(body);
                }
                catch(err){
                    winston.log('error', err);
                }
                        
            });
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
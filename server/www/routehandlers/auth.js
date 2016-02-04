import request from 'request'
import winston from '../../logger'

function slackoauth (req,res){
    if(!req.body.error){
        if(req.body.code){
            request('https://slack.com/api/oauth.access',function(error, response, body){
                        if(error) {
                            console.log(error);
                        } else {
                            try{
                            winston.log('info',body);    
                            //res.send(body);
                            //res.send(JSON.parse(body));
                            //res.send(JSON.stringify(body));
                            //res.send(body.access_token);
                            //res.send(JSON.parse(body).access_token);
                            }
                            catch(err){
                                winston.log('error',err);
                            }
                        }
                        });
        }
        
    }else{
        winston.log('error',req.body.error);
    }
}

export {slackoauth};
import request from 'request'
import winston from '../../logger'
import url from 'url'

function slackoauth (req,res){
    let querystring = url.parse(req.url,true).query;
  
        if(querystring.code){
           
            request('https://slack.com/api/oauth.access?client_id=2605154976.20361890802&client_secret=5467921f878c4f13496d11b41623a221&code='+ querystring.code,
            function(error, response, body){
                
                res.send(body);
                return;
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
        
    
}

export {slackoauth};
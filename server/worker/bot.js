import Slack from 'slack-client'
import socketclient from 'socket.io-client'
import winston from '../logger'
import * as slackhelper from '../helpers/slackhelper'
import co from 'co'
import * as Models from '../models/'
import request from 'request'



export default class Slackbot{

    constructor(io){
        //this is the socketio server bound to the same port as expressjs. Browser clients  connect to this socket.
        this.socketioServer=io;
        this.slack=new Slack('', true, true);
        
    }
    
    registerSlackListeners(creator){
        let self=this;
        this.slack.on('message', function(message) {
           
            co(function* () {
                try {
                //ignore messages sent by the bot.
                if(message.user===self.slack.self.id){
                    return;
                }
                
                let slide=yield slackhelper.processMessage(message);
                self.socketioServer.emit('DisplaySlackMessage',slide);
                //check if the message is an image or snippet. 
               /* if (slide.slideAssetUrl !='' && slide.slideMode!='snippet'){
                            self.socketioServer.emit('DisplaySlackMessage',{creator:creator,src:slide.slideAssetUrl,isImage:true });
                }
                else{
                    self.socketioServer.emit('DisplaySlackMessage',{creator:creator,text:slide.slideText});
                }*/
                }catch(err){
                    winston.log('error', err.stack);
                }
                
            }).catch((err) => {
                winston.log('error', err.stack);
            });
        });
    }

   registerSocketIoListeners(){
    this.socketioServer.on('connection', function(socket){
            socket.on('disconnect', function(){
                
            });
        });
  }
  
 
}
   

 
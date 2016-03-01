import Slack from 'slack-client'
import socketclient from 'socket.io-client'
import winston from '../logger'
import * as slackhelper from '../helpers/slackhelper'
import co from 'co'
import * as Models from '../models/'
import request from 'request'
import socketioserver from 'socket.io';


export default class Slackbot{
    
    
    constructor(io){
        //this is the server-side socket client which emits SlackMessage events when there is a
        //message from Slack. 
        this.clientio=socketclient(process.env.SOCKETIO_ADDRESS);
        
        //this is the socketio server bound to the same port as expressjs. Browser clients as well as the 
        //server-side client, this.clientio, connect to this socket.
        this.socketioServer=io;
        
        this.slack=new Slack('', true, true);
        //namespace for socket io
        this.socketioNamespace={};
        /*
        this.slack=new Slack('xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v', true, true);
        this.slack.login();
        let self=this;
        this.slack.on('message', function(message) {
            console.log(message);
            console.log(message.file.mode); //snippet, post, hosted , external
            console.log(message.file.filetype);
            console.log(message.file.mimetype);
            console.log(message.subtype);
            console.log(message.file.comments_count);
            console.log(message.file.initial_comment.comment);
            console.log(message.file.title);
            console.log(message.file.pretty_type);
            console.log(message.file.url_private_download);
            
            //for snippets call like below:
            request({headers: 
            {'Authorization': 'Bearer xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v'},
            url:message.file.url_private_download},function(err,res){
                
                //console.log(res.body); //contains text of snippet body
            });
            //for images call like below:
            request({headers: {'Authorization': 'Bearer xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v'},encoding:null,url:message.file.url_private_download},function(err,res,body){
            self.socketioServer.emit('DisplaySlackMessage',{src:'data:' + message.file.mimetype + ';base64,' + body.toString('base64'),isImage:true });
                
            });
            
            
            //snippet:
            //message.subtype=file_share
            //message.file.comments_count (should not be zero)
            //message.file.initial_comment.comment (will give the snippet comment)
            //message.file.title -will give you snippet title
            //message.file.pretty_type - will give you C#, etc
            //message.file.url_private_download - url to the file.
            
        });
        */
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
                //check if the message is an image or snippet. 
               
                    if (slide.slideAssetUrl !='' && slide.slideMode!='snippet'){
                            //self.clientio.emit('SlackMessage',{src:slide.slideAssetUrl,isImage:true });
                            self.socketioServer.emit('DisplaySlackMessage',{creator:creator,src:slide.slideAssetUrl,isImage:true });
                          //request({headers: {'Authorization': 'Bearer ' + self.slack.token},encoding:null,url:slide.slideAssetUrl},
                            //function(err,res,body){
                            //if(err){
                              //  winston.log('error',err);
                            //}else{
                              //  //emit SlackMessage event to the server- socketioServer.
                                //self.socketioServer.emit('DisplaySlackMessage',{src:'data:' + slide.slideMimeType + ';base64,' 
                                //+ body.toString('base64'),isImage:true });
                            //}
                
                     //});
                    }
                else{
                    //emit SlackMessage event to the server- socketioServer.
                    self.socketioServer.emit('DisplaySlackMessage',{creator:creator,text:slide.slideText});
                    //self.clientio.emit('SlackMessage',slide.slideText);
                }
                }catch(err){
                    winston.log('error', err.stack);
                }
                
            }).catch((err) => {
                winston.log('error', err.stack);
            });
        });
    }

   registerSocketIoListeners(){
    
    //this.socketioNamespace=this.socketioServer.of(socketioNamespaceName);  
    //this.clientio=socketclient(process.env.SOCKETIO_ADDRESS + '/' + socketioNamespaceName); 
    let self=this;
    this.socketioServer.on('connection', function(socket){
            
            socket.on('disconnect', function(){
                
            });

            //listener for SlackMessage event emitted by handler of slack.on('message')
            socket.on('SlackMessage', function(msg){ 
                //emit message to connected browser clients
                self.socketioServer.emit('DisplaySlackMessage',msg);
            });
        });
  }
  
 
}
   

 
import Slack from 'slack-client'
import socketclient from 'socket.io-client'
import winston from '../logger'


export default class Slackbot{
    constructor(io){
        //this is the server-side socket client which emits SlackMessage events when there is a
        //message from Slack. 
        this.clientio=socketclient(process.env.SOCKETIO_ADDRESS);
        //this is the socketio server bound to the same port as expressjs. Browser clients as well as the 
        //server-side client, this.clientio, connect to this socket.
        this.socketioServer=io;
        this.slack = new Slack('xoxp-2605154976-2605154980-20366174116-297e0ed68c', true, true);
        this.slack.login();
    }

   registerlisteners(){
    let self=this;
    self.socketioServer.on('connection', function(socket){
            
            socket.on('disconnect', function(){
                
            });
            //listener for SlackMessage event emitted by handler of slack.on('message')
            socket.on('SlackMessage', function(msg){ 
                //emit message to connected browser clients
                self.socketioServer.emit('SlackMessage',msg);
            });
        });
    this.slack.on('message', function(message) {
        console.log(message);
        winston.log('info',message.text);
        //when message arrives from Slack, emit SlackMessage event to the server- socketioServer.
        self.clientio.emit('SlackMessage',message.text);
    });
  }
  
}
   

 
import config from '../config.js'
import Slack from 'slack-client'

import socketclient from 'socket.io-client';
//const io=socketclient('http://localhost:8080');
export default class Slackbot{
    constructor(io){
        this.clientio=socketclient(process.env.SOCKETIO_ADDRESS);
        this.io=io;
        this.slack = new Slack(config.slackBotUserToken, true, true);
        this.slack.login();
    }

   registerlisteners(){
    let self=this;
    self.io.on('connection', function(socket){
           
            console.log('another user connected');
            console.log(socket.address);
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
            socket.on('chat message', function(msg){
                console.log('message: ' + msg);
                self.io.emit('chat message',msg);
            });
        });
    this.slack.on('message', function(message) {
        self.clientio.emit('chat message',message.text);
    });
  }
  
}
   

 
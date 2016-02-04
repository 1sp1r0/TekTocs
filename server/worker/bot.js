import config from '../config.js'
import Slack from 'slack-client'

import socketclient from 'socket.io-client';
const io=socketclient('http://localhost:8080');
/*
 io.on('connection', function(socket){
            console.log('anothe user connected');
        });
        
        io.on('chat message', function(msg){
            console.log('message: ' + msg);
        });*/

const slack = new Slack(config.slackBotUserToken, true, true);
slack.login();
    slack.on('message', function(message) {
        io.emit('chat message','hello');
    });

      

 
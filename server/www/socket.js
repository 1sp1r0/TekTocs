  
 export default function registerListeners(io){
 
        io.on('connection', function(socket){
            console.log('another user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
            socket.on('chat message', function(msg){
                console.log('message: ' + msg);
            });
        });
        
        
  }


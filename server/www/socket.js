  import  Server from 'socket.io';
  const socket= new Server();
  
  function registerListeners(httpserver){
     let io =socket.listen(httpserver);
      
        io.on('connection', function(socket){
            console.log('a user connected');
        });
  }

export {registerListeners};
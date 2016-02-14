import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

 router.get('/oauth', function(req,res){
       handlerMappings['/slack/oauth'][req.method.toLowerCase()](req,res);
    } );
    
    router.post('/command', function(req,res){
       handlerMappings['/slack/command'][req.method.toLowerCase()](req,res);
    } );
    
    router.post('/commands/startlive', function(req,res){
       handlerMappings['/slack/commands/startlive'][req.method.toLowerCase()](req,res);
    } );
    
    router.post('/commands/start', function(req,res){
       handlerMappings['/slack/commands/start'][req.method.toLowerCase()](req,res);
    } );
    
    router.post('/commands/end', function(req,res){
       handlerMappings['/slack/commands/end'][req.method.toLowerCase()](req,res);
    } );
    
      router.post('/commands/publish', function(req,res){
       handlerMappings['/slack/commands/publish'][req.method.toLowerCase()](req,res);
    } );
    export default router;
import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();


router.get('/users/:userid/slideshows/:slideshowid', function(req,res){
       handlerMappings['/api/users/:userid/slideshows/:slideshowid'][req.method.toLowerCase()](req,res);
 });

router.get('/users/:userid/slideshows', function(req,res){
       handlerMappings['/api/users/:userid/slideshows'][req.method.toLowerCase()](req,res);
 });
 
 router.get('/users/:userid', function(req,res){
       handlerMappings['/api/users/:userid'][req.method.toLowerCase()](req,res);
 });

export default router;
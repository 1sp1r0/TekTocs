import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();


router.get('/:userid/:slideshowid', function(req,res){
       handlerMappings['/api/:userid/:slideshowid'][req.method.toLowerCase()](req,res);
 });

router.get('/:userid', function(req,res){
       handlerMappings['/api/:userid'][req.method.toLowerCase()](req,res);
 });

export default router;
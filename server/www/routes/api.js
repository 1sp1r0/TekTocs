import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();


router.get('/:user/:slideshow', function(req,res){
       handlerMappings['/api/:user/:slideshow'][req.method.toLowerCase()](req,res);
 });

router.get('/:user', function(req,res){
       handlerMappings['/api/:user'][req.method.toLowerCase()](req,res);
 });

export default router;
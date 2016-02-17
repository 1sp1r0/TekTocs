import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

router.get('/:user', function(req,res){
       handlerMappings['/slideshows/:user'][req.method.toLowerCase()](req,res);
 });
router.get('/:user/:slideshow', function(req,res){
       handlerMappings['/slideshows/:user/:slideshow'][req.method.toLowerCase()](req,res);
 });



export default router;
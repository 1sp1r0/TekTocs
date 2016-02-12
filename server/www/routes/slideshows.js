import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

router.get('/:team/:user', function(req,res){
       handlerMappings['/slideshows/:team/:user'][req.method.toLowerCase()](req,res);
 });
router.get('/:team/:user/:slideshow', function(req,res){
       handlerMappings['/slideshows/:team/:user/:slideshow'][req.method.toLowerCase()](req,res);
 });



export default router;
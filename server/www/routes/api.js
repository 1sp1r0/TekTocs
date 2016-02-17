import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

// define the home page route
router.get('/:user/:slideshow', function(req,res){
       handlerMappings['/api/:user/:slideshow'][req.method.toLowerCase()](req,res);
 });



export default router;
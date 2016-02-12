import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

// define the home page route
router.get('/', function(req,res){
       handlerMappings['/'][req.method.toLowerCase()](req,res);
 });


export default router;
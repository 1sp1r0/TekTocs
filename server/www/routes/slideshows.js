import express from 'express'
import handlerMappings  from  '../routehandlermappings';
const router=express.Router();

router.get('/:userid', function(req,res){
       handlerMappings['/slideshows/:userid'][req.method.toLowerCase()](req,res);
 });
router.get('/:userid/:slideshowid', function(req,res){
       handlerMappings['/slideshows/:userid/:slideshowid'][req.method.toLowerCase()](req,res);
 });

router.get('/live/:userid/:slideshowid', function(req,res){
       handlerMappings['/slideshows/live/:userid/:slideshowid'][req.method.toLowerCase()](req,res);
 });

export default router;
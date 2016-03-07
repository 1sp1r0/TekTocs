
import co from 'co'
import winston from '../../logger'
import * as slackhelper from '../../helpers/slackhelper'
import * as Models from '../../models/'
import "babel-polyfill"
import moment from 'moment'
import tag from '../../helpers/tag'

export function getUserSlideshow (req,res){
    try{
        co(function* () {
           try{
              
                let userid=req.params.userid;
                let slideshowid=req.params.slideshowid;
                let slashCommand = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{createDate:1,team_id:1,'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                        if(slashCommand.attachments){
                           let name=(slashCommand.attachments.slideshow.creator.real_name?
                                slashCommand.attachments.slideshow.creator.real_name:
                                (slashCommand.attachments.slideshow.creator.name?
                                slashCommand.attachments.slideshow.creator.name:''));
                           
                           if(slashCommand.attachments.slideshow.slides.length>0){  
                                  let coverSlide={};
                                  let slide=slashCommand.attachments.slideshow.slides[0];
                                  let mimeType=slide.slideMimeType;
                                  if (slide.slideAssetUrl !='' && slide.slideMode != 'snippet'){
                                      coverSlide={isImage:true,src:slide.slideAssetUrl};
                                  }else{
                                      coverSlide={isImage:false,text:slide.slideText};
                                  }
                                  
                                 res.status(200).send({name:name,coverslide:coverSlide,mimeType:mimeType,
                                        createDateText:'created ' + moment(slashCommand.createDate).fromNow(),
                                        slideshow:{title:slashCommand.attachments.slideshow.title,
                                        slides:slashCommand.attachments.slideshow.slides,
                                        creator:slashCommand.attachments.slideshow.creator}});       
                           }
                           
                        }else{
                            res.status(500).send(tag`noData`);
                            
                        }
             }catch (err) {
                    winston.log('error', err.stack);
                    res.sendStatus(500);
             }
       }).catch((err) => {
            winston.log('error', err.stack);
            res.sendStatus(500);
      });
    }catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

export function getUserSlideshows (req,res){
    
    try{
        co(function* () {
           try{
                let userid=req.params.userid;
                let slashCommands = yield Models.SlashCommand.find({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid},
                        {createDate:1,team_id:1,'attachments.slideshow':1},
                        {sort:{createDate:-1},skip: req.query.skip, limit: 15})
                        .populate('attachments.slideshow.creator')
                        .exec();
                 if(slashCommands && slashCommands.length>0){
                    let result= slashCommands.map((slashCommand)=>{
                        let coverSlide={};
                        let name='';
                         if(slashCommand.attachments){
                             name=(slashCommand.attachments.slideshow.creator.real_name?
                                slashCommand.attachments.slideshow.creator.real_name:
                                (slashCommand.attachments.slideshow.creator.name?
                                slashCommand.attachments.slideshow.creator.name:''));
                              if(slashCommand.attachments.slideshow.slides.length>0){  
                                  let slide=slashCommand.attachments.slideshow.slides[0];
                                  if (slide.slideAssetUrl !='' && slide.slideMode != 'snippet'){
                                      coverSlide={isImage:true,src:slide.slideAssetUrl};
                                  }else{
                                      coverSlide={isImage:false,src:''};
                                  }
                              }   
                         }
                         
                         return {name:name,coverslide:coverSlide,
                                        createDateText:'created ' + moment(slashCommand.createDate).fromNow(),
                                        slideshow:{title:slashCommand.attachments.slideshow.title,
                                        slideCount:slashCommand.attachments.slideshow.slides.length===1?
                                        slashCommand.attachments.slideshow.slides.length + ' slide': 
                                        slashCommand.attachments.slideshow.slides.length + ' slides',
                                        short_id:slashCommand.attachments.slideshow.short_id,
                                        creator:{_id:slashCommand.attachments.slideshow.creator._id,
                                        image_32:slashCommand.attachments.slideshow.creator.image_32}}};  
                     });
                     res.status(200).send({ok:true,result:result});
                 }   else{
                     res.status(200).send({ok:false,result:[]});
                 }    
                
             }catch (err) {
                    winston.log('error', err.stack);
                    res.sendStatus(500);
             }
       }).catch((err) => {
            winston.log('error', err.stack);
            res.sendStatus(500);
      });
    }catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
}

export function getUser (req,res){
    
    try{
        co(function* () {
           try{
               let userid=req.params.userid;
               let slackUser = yield Models.SlackUser.findOne({ 
                        _id:userid})
                        .exec();
               if(slackUser){
                   let name=(slackUser.real_name?
                                slackUser.real_name:
                                (slackUser.name?
                                slackUser.name:''));
                   res.status(200).send({ok:true,result:{name:name,
                   image:slackUser.image_72,description:''}});
               }else{
                   res.status(200).send({ok:false,result:null});
               }        
               }catch (err) {
                    winston.log('error', err.stack);
                    res.sendStatus(500);
             }
       }).catch((err) => {
            winston.log('error', err.stack);
            res.sendStatus(500);
      });
    }catch (err) {
        winston.log('error',err.message);
        res.sendStatus(500);
    }
    
}



import co from 'co'
import winston from '../../logger'
import * as slackhelper from '../../helpers/slackhelper'
import * as Models from '../../models/'
import "babel-polyfill"

export function getUserSlideshow (req,res){
    try{
        co(function* () {
           try{
               
                let userid=req.params.userid;
                let slideshowid=req.params.slideshowid;
                let slashCommand = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{team_id:1,'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                        if(slashCommand.attachments){
                           let name=(slashCommand.attachments.slideshow.creator.real_name?
                                slashCommand.attachments.slideshow.creator.real_name:
                                (slashCommand.attachments.slideshow.creator.name?
                                slashCommand.attachments.slideshow.creator.name:''));
                           if(slashCommand.attachments.slideshow.slides.length>0){  
                                  let mimeType=slashCommand.attachments.slideshow.slides[0].slideMimeType;
                                    let coverSlide= yield slackhelper.getCoverSlide(
                                        slashCommand.attachments.slideshow.slides[0],slashCommand.team_id);
                                 res.status(200).send({name:name,coverslide:coverSlide,mimeType:mimeType,
                                        slideshow:{title:slashCommand.attachments.slideshow.title,
                                        creator:slashCommand.attachments.slideshow.creator}});       
                           }
                           
                        }
                res.status(500).send('no data');
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
                let slideshows = yield Models.SlashCommand.find({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid},{'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                res.status(200).send(slideshows);
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


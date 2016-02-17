
import co from 'co'
import winston from '../../logger'

import * as Models from '../../models/'
import "babel-polyfill"

export function getUserSlideshow (req,res){
    try{
        co(function* () {
           try{
                let userid=req.params.user;
                let slideshowid=req.params.slideshow;
                let slashCommand = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                res.status(200).send(slashCommand);
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


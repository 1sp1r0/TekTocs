import mongoose from 'mongoose'
import shortid from 'shortid'



let slideSchema = mongoose.Schema({
    slideIndex:Number,
    slideText:String,
    slideCaption:String,
    slideAssetUrl:String,
    slideTitle:String,
    slideMimeType:String,
    slideMode:String,
 });

let Slide = mongoose.model('Slide', slideSchema);

let slashCommandSchema = mongoose.Schema({
    team_id:String,
    team_domain: String,
    channel_id:String,
    user_id:String,
    user_name:String,
    command:String,
    commandType:String,
    text:String,
    response_url:String,
    attachments:{
        slideshow:{
            start_ts:String,
            end_ts:String,
            short_id:{ type: String, index: true },
            title: {type: String, index: true },
            creator:{type: String, ref: 'SlackUser'},
            slides:[slideSchema],
            published:Boolean
        }
    },
    pending:Boolean,
    createDate:Date
});

slashCommandSchema.index({ channel_id: 1, user_id: 1, commandType:1 });


let SlashCommand = mongoose.model('SlashCommand', slashCommandSchema);

export  {SlashCommand,Slide};
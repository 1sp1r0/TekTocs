import mongoose from 'mongoose'
import shortid from 'shortid'

let slackUserSchema = mongoose.Schema({
    _id:String,
    short_id: { type: String, index: true },
    user_id:{ type: String, index: true },
    name:String,
    first_name:String,
    last_name:String,
    real_name:String,
    email:String,
    image_24:String,
    image_32:String,
    image_48:String,
    image_72:String,
    image_192:String
  });



let SlackUser = mongoose.model('SlackUser', slackUserSchema);

export  {SlackUser};

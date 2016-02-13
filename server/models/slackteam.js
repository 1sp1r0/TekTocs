import mongoose from 'mongoose'
import shortid from 'shortid'

let slackTeamSchema = mongoose.Schema({
    shortid: { type: String, index: true },
    ok:Boolean,
    access_token: { type: String, index: true },
    scope:String,
    team_name:String,
    team_id:{ type: String, index: true },
    incoming_webhook:{url:String,channel:String,configuration_url:String},
    bot:{bot_user_id:String,bot_access_token:String}
});



let SlackTeam = mongoose.model('SlackTeam', slackTeamSchema);

export  {SlackTeam};
import mongoose from 'mongoose'


let slackTeamSchema = mongoose.Schema({
    ok:Boolean,
    access_token: String,
    scope:String,
    team_name:String,
    team_id:String,
    incoming_webhook:{url:String,channel:String,configuration_url:String},
    bot:{bot_user_id:String,bot_access_token:String}
});

let SlackTeam = mongoose.model('SlackTeam', slackTeamSchema);

export default SlackTeam;
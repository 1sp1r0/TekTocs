import mongoose from 'mongoose'


let slashCommandSchema = mongoose.Schema({
    team_id:String,
    team_domain: String,
    channel_id:String,
    channel_name:String,
    user_id:String,
    user_name:String,
    command:String,
    text:String,
    response_url:String,
    pending:Boolean
});

slashCommandSchema.index({ team_id: 1, user_id: 1, command:1 });

let SlashCommand = mongoose.model('SlashCommand', slashCommandSchema);

export  {SlashCommand};
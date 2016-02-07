import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import * as Models from '../../models/'
import "babel-polyfill"

export function start(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}

export function startLive(req,res){
   if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        co(function* () {
            try{
                let result = JSON.parse(req.body);
                if(result.ok){
                    let slashCommand= new Models.SlashCommand(result);
                    let saveResult=yield slashCommand.save();
                    res.status(200).send('Hello ' + result.channel.id, 200);
                    
                }else{
                    res.status(200).send('Error ' + body, 200);
                }
            }
            catch (err) {
                    winston.log('error', err);
                    res.sendStatus(500);
                }
        }).catch((err) => {
                winston.log('error', err.stack);
                res.sendStatus(500);
            });;
        
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}

function saveSlashCommand(result) {
    return new Promise((resolve, reject) => {
        try {
            SlackTeam.update({ access_token: result.access_token }, result, { upsert: true }, function (err, raw) {
                if (err) {
                    reject(err);
                } else {
                    resolve(raw);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
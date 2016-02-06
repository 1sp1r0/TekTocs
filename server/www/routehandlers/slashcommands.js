import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import SlackTeam from '../../models/slackteam.js'
import "babel-polyfill"

export function start(req, res) {
    if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) {
        res.status(200).send('Hello ' + req.body.user_name, 200);
    } else {
        winston.log('warn', 'unauthorized slash command access');
    }
}
import config from '../config.js'
import Slack from 'slack-client'

const slack = new Slack(config.slackBotUserToken, true, true);
slack.login();

slack.on('message', function(message) {console.log(message);});
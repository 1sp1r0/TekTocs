import request from 'request-promise'
import co from 'co'
import winston from '../../logger'
import url from 'url'
import SlackTeam from '../../models/slackteam.js'
import "babel-polyfill"
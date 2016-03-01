'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slackClient = require('slack-client');

var _slackClient2 = _interopRequireDefault(_slackClient);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _slackhelper = require('../helpers/slackhelper');

var slackhelper = _interopRequireWildcard(_slackhelper);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _models = require('../models/');

var Models = _interopRequireWildcard(_models);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slackbot = function () {
    function Slackbot(io) {
        _classCallCheck(this, Slackbot);

        //this is the server-side socket client which emits SlackMessage events when there is a
        //message from Slack.
        this.clientio = (0, _socket2.default)(process.env.SOCKETIO_ADDRESS);

        //this is the socketio server bound to the same port as expressjs. Browser clients as well as the
        //server-side client, this.clientio, connect to this socket.
        this.socketioServer = io;

        this.slack = new _slackClient2.default('', true, true);
        //namespace for socket io
        this.socketioNamespace = {};
        /*
        this.slack=new Slack('xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v', true, true);
        this.slack.login();
        let self=this;
        this.slack.on('message', function(message) {
            console.log(message);
            console.log(message.file.mode); //snippet, post, hosted , external
            console.log(message.file.filetype);
            console.log(message.file.mimetype);
            console.log(message.subtype);
            console.log(message.file.comments_count);
            console.log(message.file.initial_comment.comment);
            console.log(message.file.title);
            console.log(message.file.pretty_type);
            console.log(message.file.url_private_download);
            
            //for snippets call like below:
            request({headers: 
            {'Authorization': 'Bearer xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v'},
            url:message.file.url_private_download},function(err,res){
                
                //console.log(res.body); //contains text of snippet body
            });
            //for images call like below:
            request({headers: {'Authorization': 'Bearer xoxb-17952512917-xCZUmeEjTLLjR3DtXqAkLv2v'},encoding:null,url:message.file.url_private_download},function(err,res,body){
            self.socketioServer.emit('DisplaySlackMessage',{src:'data:' + message.file.mimetype + ';base64,' + body.toString('base64'),isImage:true });
                
            });
            
            
            //snippet:
            //message.subtype=file_share
            //message.file.comments_count (should not be zero)
            //message.file.initial_comment.comment (will give the snippet comment)
            //message.file.title -will give you snippet title
            //message.file.pretty_type - will give you C#, etc
            //message.file.url_private_download - url to the file.
            
        });
        */
    }

    _createClass(Slackbot, [{
        key: 'registerSlackListeners',
        value: function registerSlackListeners(creator) {
            var self = this;
            this.slack.on('message', function (message) {

                (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
                    var slide;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;

                                    if (!(message.user === self.slack.self.id)) {
                                        _context.next = 3;
                                        break;
                                    }

                                    return _context.abrupt('return');

                                case 3:
                                    _context.next = 5;
                                    return slackhelper.processMessage(message);

                                case 5:
                                    slide = _context.sent;

                                    //check if the message is an image or snippet.

                                    if (slide.slideAssetUrl != '' && slide.slideMode != 'snippet') {
                                        //self.clientio.emit('SlackMessage',{src:slide.slideAssetUrl,isImage:true });
                                        self.socketioServer.of(creator).emit('DisplaySlackMessage', { creator: creator, src: slide.slideAssetUrl, isImage: true });
                                        //request({headers: {'Authorization': 'Bearer ' + self.slack.token},encoding:null,url:slide.slideAssetUrl},
                                        //function(err,res,body){
                                        //if(err){
                                        //  winston.log('error',err);
                                        //}else{
                                        //  //emit SlackMessage event to the server- socketioServer.
                                        //self.socketioServer.emit('DisplaySlackMessage',{src:'data:' + slide.slideMimeType + ';base64,'
                                        //+ body.toString('base64'),isImage:true });
                                        //}

                                        //});
                                    } else {
                                            //emit SlackMessage event to the server- socketioServer.
                                            self.socketioServer.of(creator).emit('DisplaySlackMessage', { creator: creator, text: slide.slideText });
                                            //self.clientio.emit('SlackMessage',slide.slideText);
                                        }
                                    _context.next = 12;
                                    break;

                                case 9:
                                    _context.prev = 9;
                                    _context.t0 = _context['catch'](0);

                                    _logger2.default.log('error', _context.t0.stack);

                                case 12:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 9]]);
                })).catch(function (err) {
                    _logger2.default.log('error', err.stack);
                });
            });
        }
    }, {
        key: 'registerSocketIoListeners',
        value: function registerSocketIoListeners() {

            //this.socketioNamespace=this.socketioServer.of(socketioNamespaceName); 
            //this.clientio=socketclient(process.env.SOCKETIO_ADDRESS + '/' + socketioNamespaceName);
            var self = this;
            this.socketioServer.on('connection', function (socket) {

                socket.on('disconnect', function () {});

                //listener for SlackMessage event emitted by handler of slack.on('message')
                socket.on('SlackMessage', function (msg) {
                    //emit message to connected browser clients
                    self.socketioServer.emit('DisplaySlackMessage', msg);
                });
            });
        }
    }]);

    return Slackbot;
}();

exports.default = Slackbot;
webpackJsonpReactRenderers([1],{

/***/ 148:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.postMessageToSlack = postMessageToSlack;
	exports.openIm = openIm;
	exports.getUserinfo = getUserinfo;
	exports.getImHistory = getImHistory;
	exports.processMessage = processMessage;
	exports.getSlide = getSlide;
	exports.getSlideshowEndingTimestamp = getSlideshowEndingTimestamp;
	exports.getUserSlideshow = getUserSlideshow;

	var _requestPromise = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"request-promise\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _requestPromise2 = _interopRequireDefault(_requestPromise);

	var _models = __webpack_require__(149);

	var Models = _interopRequireWildcard(_models);

	var _co = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"co\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _co2 = _interopRequireDefault(_co);

	function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	        return obj;
	    } else {
	        var newObj = {};if (obj != null) {
	            for (var key in obj) {
	                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	            }
	        }newObj.default = obj;return newObj;
	    }
	}

	function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { default: obj };
	}

	function _toConsumableArray(arr) {
	    if (Array.isArray(arr)) {
	        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	            arr2[i] = arr[i];
	        }return arr2;
	    } else {
	        return Array.from(arr);
	    }
	}

	function postMessageToSlack(token, channel, msg) {
	    return (0, _requestPromise2.default)({
	        url: 'https://slack.com/api/chat.postMessage',
	        qs: {
	            "token": token,
	            "channel": channel,
	            "text": msg,
	            "as_user": true
	        } });
	}

	function openIm(token, userId) {
	    return (0, _requestPromise2.default)({
	        url: 'https://slack.com/api/im.open',
	        qs: {
	            "token": token,
	            "user": userId
	        } });
	}

	function getUserinfo(token, userId) {
	    return (0, _requestPromise2.default)({
	        url: 'https://slack.com/api/users.info',
	        qs: {
	            "token": token,
	            "user": userId
	        } });
	}

	function getImHistory(token, channel, oldest, latest, count) {
	    return (0, _requestPromise2.default)({
	        url: 'https://slack.com/api/im.history',
	        qs: {
	            "token": token,
	            "channel": channel,
	            "oldest": oldest,
	            "latest": latest,
	            "count": count
	        } });
	}

	function processMessage(message) {
	    return new Promise(function (resolve, reject) {
	        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	            var slashCommand, team, botAccessToken, slideIndex, slide;
	            return regeneratorRuntime.wrap(function _callee$(_context) {
	                while (1) {
	                    switch (_context.prev = _context.next) {
	                        case 0:
	                            _context.prev = 0;
	                            _context.next = 3;
	                            return Models.SlashCommand.findOne({ channel_id: message.channel,
	                                user_id: message.user, pending: true,
	                                commandType: 'start' }).sort({ createDate: -1 }).limit(1).select('team_id attachments.slideshow').exec();

	                        case 3:
	                            slashCommand = _context.sent;

	                            if (slashCommand) {
	                                _context.next = 8;
	                                break;
	                            }

	                            reject('Slideshow has not been started yet.');
	                            _context.next = 24;
	                            break;

	                        case 8:
	                            _context.next = 10;
	                            return getSlackTeam(slashCommand.team_id);

	                        case 10:
	                            team = _context.sent;
	                            botAccessToken = team.bot.bot_access_token;
	                            slideIndex = getNextSlideindex(slashCommand.attachments.slideshow.slides);
	                            _context.next = 15;
	                            return getSlide(message, slideIndex, botAccessToken);

	                        case 15:
	                            slide = _context.sent;

	                            if (!slide) {
	                                _context.next = 23;
	                                break;
	                            }

	                            slashCommand.attachments.slideshow.slides.push(slide);
	                            _context.next = 20;
	                            return slashCommand.attachments.slideshow.save();

	                        case 20:
	                            resolve(slide);
	                            _context.next = 24;
	                            break;

	                        case 23:
	                            reject("error getting slide data");

	                        case 24:
	                            _context.next = 29;
	                            break;

	                        case 26:
	                            _context.prev = 26;
	                            _context.t0 = _context['catch'](0);

	                            reject(_context.t0.stack);

	                        case 29:
	                        case 'end':
	                            return _context.stop();
	                    }
	                }
	            }, _callee, this, [[0, 26]]);
	        })).catch(function (err) {
	            reject(err.stack);
	        });
	    });
	}

	function getNextSlideindex(slides) {
	    var _Math;

	    return slides.length > 0 ? (_Math = Math).max.apply(_Math, _toConsumableArray(slides.map(function (slide) {
	        return slide.slideIndex;
	    }))) + 1 : 1;
	}

	function getSlide(message, slideIndex, botAccessToken) {
	    return new Promise(function (resolve, reject) {
	        (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
	            var slideCaption, slideText, slideAssetUrl, slideMode;
	            return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                while (1) {
	                    switch (_context2.prev = _context2.next) {
	                        case 0:
	                            _context2.prev = 0;
	                            slideCaption = '';
	                            slideText = '';
	                            slideAssetUrl = '';
	                            slideMode = '';

	                            if (!(message.subtype === 'file_share')) {
	                                _context2.next = 16;
	                                break;
	                            }

	                            slideMode = message.file.mode;
	                            slideAssetUrl = message.file.url_private_download;
	                            if (message.file.comments_count > 0) {
	                                slideCaption = message.file.initial_comment.comment;
	                            }

	                            if (!(message.file.mode === 'snippet')) {
	                                _context2.next = 13;
	                                break;
	                            }

	                            _context2.next = 12;
	                            return getSnippetText(message.file.url_private_download, botAccessToken);

	                        case 12:
	                            slideText = _context2.sent;

	                        case 13:
	                            resolve(new Models.Slide({
	                                slideIndex: slideIndex,
	                                slideText: slideText,
	                                slideCaption: slideCaption,
	                                slideAssetUrl: slideAssetUrl,
	                                slideTitle: message.file.title,
	                                slideMimeType: message.file.mimetype,
	                                slideMode: slideMode
	                            }));
	                            _context2.next = 17;
	                            break;

	                        case 16:
	                            resolve(new Models.Slide({ slideIndex: slideIndex,
	                                slideText: message.text,
	                                slideCaption: '',
	                                slideAssetUrl: '',
	                                slideTitle: '',
	                                slideMimeType: '',
	                                slideMode: '' }));

	                        case 17:
	                            _context2.next = 22;
	                            break;

	                        case 19:
	                            _context2.prev = 19;
	                            _context2.t0 = _context2['catch'](0);

	                            reject(_context2.t0.stack);

	                        case 22:
	                        case 'end':
	                            return _context2.stop();
	                    }
	                }
	            }, _callee2, this, [[0, 19]]);
	        })).catch(function (err) {
	            reject(err.stack);
	        });
	    });
	}

	function getSlackTeam(teamId) {
	    return Models.SlackTeam.findOne({ team_id: teamId }).select('bot.bot_access_token').exec();
	}

	function getSnippetText(url, botAccessToken) {
	    return new Promise(function (resolve, reject) {
	        (0, _requestPromise2.default)({ headers: { 'Authorization': 'Bearer ' + botAccessToken },
	            url: url }, function (err, res) {
	            if (err) {
	                reject(err);
	            } else {
	                resolve(res.body);
	            }
	        });
	    });
	}

	function getSlideshowEndingTimestamp(message, userId, botAccessToken) {
	    return new Promise(function (resolve, reject) {
	        (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
	            var imResponse, im, postMessageResponse, postMessage;
	            return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                while (1) {
	                    switch (_context3.prev = _context3.next) {
	                        case 0:
	                            _context3.prev = 0;
	                            _context3.next = 3;
	                            return openIm(botAccessToken, userId);

	                        case 3:
	                            imResponse = _context3.sent;
	                            im = JSON.parse(imResponse);

	                            if (!im.ok) {
	                                _context3.next = 13;
	                                break;
	                            }

	                            _context3.next = 8;
	                            return postMessageToSlack(botAccessToken, im.channel.id, message);

	                        case 8:
	                            postMessageResponse = _context3.sent;
	                            postMessage = JSON.parse(postMessageResponse);

	                            if (postMessage.ok) {
	                                resolve(postMessage.ts);
	                            } else {
	                                reject(postMessage.error);
	                            }
	                            _context3.next = 14;
	                            break;

	                        case 13:
	                            reject(im.error);

	                        case 14:
	                            _context3.next = 19;
	                            break;

	                        case 16:
	                            _context3.prev = 16;
	                            _context3.t0 = _context3['catch'](0);

	                            reject(_context3.t0.stack);

	                        case 19:
	                        case 'end':
	                            return _context3.stop();
	                    }
	                }
	            }, _callee3, this, [[0, 16]]);
	        })).catch(function (err) {
	            reject(err.stack);
	        });
	    });
	}

	function getUserSlideshow(userid, slideshowid) {
	    return new Promise(function (resolve, reject) {
	        try {

	            (0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
	                var slideshow;
	                return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                    while (1) {
	                        switch (_context4.prev = _context4.next) {
	                            case 0:
	                                _context4.prev = 0;
	                                _context4.next = 3;
	                                return Models.SlashCommand.findOne({
	                                    'attachments.slideshow.published': true,
	                                    'attachments.slideshow.creator': userid,
	                                    'attachments.slideshow.short_id': slideshowid }, { 'attachments.slideshow': 1 }).populate('attachments.slideshow.creator').exec();

	                            case 3:
	                                slideshow = _context4.sent;

	                                resolve(slideshow);
	                                _context4.next = 10;
	                                break;

	                            case 7:
	                                _context4.prev = 7;
	                                _context4.t0 = _context4['catch'](0);

	                                reject(_context4.t0.stack);

	                            case 10:
	                            case 'end':
	                                return _context4.stop();
	                        }
	                    }
	                }, _callee4, this, [[0, 7]]);
	            })).catch(function (err) {
	                reject(err.stack);
	            });
	        } catch (err) {
	            reject(err.message);
	        }
	    });
	}

/***/ },

/***/ 149:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slackteam = __webpack_require__(150);

	var _loop = function _loop(_key4) {
	  if (_key4 === "default") return 'continue';
	  Object.defineProperty(exports, _key4, {
	    enumerable: true,
	    get: function get() {
	      return _slackteam[_key4];
	    }
	  });
	};

	for (var _key4 in _slackteam) {
	  var _ret = _loop(_key4);

	  if (_ret === 'continue') continue;
	}

	var _slashcommand = __webpack_require__(151);

	var _loop2 = function _loop2(_key5) {
	  if (_key5 === "default") return 'continue';
	  Object.defineProperty(exports, _key5, {
	    enumerable: true,
	    get: function get() {
	      return _slashcommand[_key5];
	    }
	  });
	};

	for (var _key5 in _slashcommand) {
	  var _ret2 = _loop2(_key5);

	  if (_ret2 === 'continue') continue;
	}

	var _slackuser = __webpack_require__(152);

	var _loop3 = function _loop3(_key6) {
	  if (_key6 === "default") return 'continue';
	  Object.defineProperty(exports, _key6, {
	    enumerable: true,
	    get: function get() {
	      return _slackuser[_key6];
	    }
	  });
	};

	for (var _key6 in _slackuser) {
	  var _ret3 = _loop3(_key6);

	  if (_ret3 === 'continue') continue;
	}

/***/ },

/***/ 150:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SlackTeam = undefined;

	var _mongoose = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"mongoose\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _shortid = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"shortid\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { default: obj };
	}

	var slackTeamSchema = _mongoose2.default.Schema({
	    short_id: { type: String, index: true },
	    ok: Boolean,
	    access_token: { type: String, index: true },
	    scope: String,
	    team_name: String,
	    team_id: { type: String, index: true },
	    incoming_webhook: { url: String, channel: String, configuration_url: String },
	    bot: { bot_user_id: String, bot_access_token: String }
	});

	var SlackTeam = _mongoose2.default.model('SlackTeam', slackTeamSchema);

	exports.SlackTeam = SlackTeam;

/***/ },

/***/ 151:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Slide = exports.SlashCommand = undefined;

	var _mongoose = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"mongoose\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _shortid = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"shortid\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { default: obj };
	}

	var slideSchema = _mongoose2.default.Schema({
	    slideIndex: Number,
	    slideText: String,
	    slideCaption: String,
	    slideAssetUrl: String,
	    slideTitle: String,
	    slideMimeType: String,
	    slideMode: String
	});

	var Slide = _mongoose2.default.model('Slide', slideSchema);

	var slashCommandSchema = _mongoose2.default.Schema({
	    team_id: String,
	    team_domain: String,
	    channel_id: String,
	    user_id: String,
	    user_name: String,
	    command: String,
	    commandType: String,
	    text: String,
	    response_url: String,
	    attachments: {
	        slideshow: {
	            start_ts: String,
	            end_ts: String,
	            short_id: { type: String, index: true },
	            title: { type: String, index: true },
	            creator: { type: String, ref: 'SlackUser' },
	            slides: [slideSchema],
	            published: Boolean
	        }
	    },
	    pending: Boolean,
	    createDate: Date
	});

	slashCommandSchema.index({ channel_id: 1, user_id: 1, commandType: 1 });

	var SlashCommand = _mongoose2.default.model('SlashCommand', slashCommandSchema);

	exports.SlashCommand = SlashCommand;
	exports.Slide = Slide;

/***/ },

/***/ 152:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SlackUser = undefined;

	var _mongoose = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"mongoose\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _shortid = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"shortid\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _shortid2 = _interopRequireDefault(_shortid);

	function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { default: obj };
	}

	var slackUserSchema = _mongoose2.default.Schema({
	    _id: String,
	    user_id: { type: String, index: true },
	    name: String,
	    first_name: String,
	    last_name: String,
	    real_name: String,
	    email: String,
	    image_24: String,
	    image_32: String,
	    image_48: String,
	    image_72: String,
	    image_192: String
	});

	var SlackUser = _mongoose2.default.model('SlackUser', slackUserSchema);

	exports.SlackUser = SlackUser;

/***/ }

});
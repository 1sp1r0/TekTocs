'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _csurf = require('csurf');

var _csurf2 = _interopRequireDefault(_csurf);

var _mapping = require('./routehandlers/mapping');

var _mapping2 = _interopRequireDefault(_mapping);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var facebook = _interopRequireWildcard(_passportFacebook);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as socketserver from './socket';

var FACEBOOK_APP_ID = "dummy";
var FACEBOOK_APP_SECRET = "dummy";
var FacebookStrategy = facebook.Strategy;

_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
    //User.findById(id, function(err, user) {
    //    done(err, user);
    //});
});

_passport2.default.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    enableProof: false
}, function (accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //    return done(err, user);
    //});
}));

var port = process.env.PORT || 8080;
var app = (0, _express2.default)();
app.set('views', 'views');
app.set('view engine', 'jade');
app.use((0, _helmet2.default)());
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _csurf2.default)({ cookie: true }));
app.set('trust proxy', 1); // trust first proxy
app.use((0, _expressSession2.default)({
    secret: 't3kt0cs1sn01',
    name: 'tektocsSessionId'
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions .
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.use(function (err, req, res, next) {
    //csrf error handler
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403);
    res.send('Form data has been tampered with.');
});

if (process.env.NODE_ENV === 'development') {
    var compiler = (0, _webpack2.default)(require('../../webpack.dev.config'));
    app.use((0, _webpackDevMiddleware2.default)(compiler, {
        noInfo: true, publicPath: require('../../webpack.dev.config').output.publicPath
    }));

    app.use((0, _webpackHotMiddleware2.default)(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
}

//route middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', function (req, res) {
    _mapping2.default['/'][req.method.toLowerCase()](req, res);
});

var server = app.listen(port, function () {
    console.log('Tektocs is running on http://localhost:' + port);
});

//socketserver.registerListeners(server);
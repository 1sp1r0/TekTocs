    import express from 'express';
    import http from 'http';
    import bodyParser from 'body-parser';
    import cookieParser from 'cookie-parser';
    import csrf from 'csurf';
    import home  from  './routes/home';
    import slack from './routes/slack';
    import api from './routes/api';
    import slideshows from './routes/slideshows';
    import helmet from 'helmet';
    import passport from 'passport';
    import * as facebook from 'passport-facebook';
    import session from 'express-session';
    import socketioserver from 'socket.io';
    import Slackbot from '../worker/bot'
    import DbConnection from '../models/db'
    
    const port = process.env.PORT || 8080;
    const app =  express();
    const httpServer=http.Server(app);
    const io=socketioserver(httpServer);
    const FacebookStrategy=facebook.Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
           
    });
    
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
        enableProof: false
    },
        function(accessToken, refreshToken, profile, done) {
            
        }
    ));

    
    app.set('views', 'views'); 
    app.set('view engine', 'jade'); 
    app.use(helmet());
    app.use(express.static('public'));
    app.use(bodyParser.json());                        
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));
    app.set('trust proxy', 1) // trust first proxy
    app.use( session({
        secret : process.env.EXPRESS_SESSION_SECRET,
        name : process.env.EXPRESS_SESSION_NAME,
        })
    );
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions .
  app.use(passport.initialize());
  app.use(passport.session());
  
  //initilaize slack bot
  let slackbot= new Slackbot(io);
  slackbot.registerSocketIoListeners();
  app.slackbot=slackbot;
  
 
    
    app.use(function (err, req, res, next) {
        //Allow slack slash commands that post with the verification token.
        if (req.body.token === process.env.SLASH_COMMAND_VERIFICATION_TOKEN) return next();
        //csrf error handler
        if (err.code !== 'EBADCSRFTOKEN') return next(err);
        res.status(403)
        res.send('Form data has been tampered with.')
     });
    
    if(process.env.NODE_ENV==='development'){
        let webpack = require('webpack');
        let webpackDevMiddleware = require('webpack-dev-middleware');
        let webpackHotMiddleware = require('webpack-hot-middleware');
            let compiler = webpack(require('../../webpack.dev.config'));
            app.use(webpackDevMiddleware(compiler, {
              noInfo: true, publicPath: require('../../webpack.dev.config').output.publicPath
            }));

          app.use(webpackHotMiddleware(compiler, {
            log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
          }));
         
    }
     
    //route middleware to ensure user is authenticated 
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
            res.redirect('/login')
    }

    app.use('/', home);  
    app.use('/slack', slack); 
    app.use('/slideshows', slideshows); 
    app.use('/api', api); 

    //connect to database
    DbConnection.connect();
    
   httpServer.listen(port, function() {});
   
    process.on('exit', (code) => {
     if(io.connected){
         io.disconnect();
     }
 });
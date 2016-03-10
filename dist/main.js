var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
  pm2.start({
    script    : 'dist/www/app.js',
    name      : 'tektocs',     
    exec_mode : 'cluster',            
    instances : instances,
    max_memory_restart : maxMemory + 'M',   
    env: {                            
      "NODE_ENV": "production",
      "SOCKETIO_ADDRESS": "<ENTER YOUR SOCKETIO SERVER ADDRESS>",
      "SLASH_COMMAND_VERIFICATION_TOKEN": "<ENTER YOUR SLASH COMMAND VERIFICATION CODE>",
      "SLACK_BOT_ACCESS_TOKEN":'<ENTER YOUR SLACK BOT ACCESS TOKEN>',
      "SLACK_TEAM_ACCESS_TOKEN":"<ENTER YOUR SLACK TEAM ACCESS TOKEN>",
      "SLACK_CLIENT_ID":'<ENTER YOUR SLACK CLIENT ID>',
      "SLACK_CLIENT_SECRET":'<ENTER YOUR SLACK CLIENT SECRET>',
      "MONGOLAB_URI" : 'ENTER YOUR MONGOLAB MONGODB URI',
      "AWS_ACCESS_KEY_ID": 'ENTER YOUR AWS ACCESS KEY ID',
      "AWS_SECRET_ACCESS_KEY":'ENTER YOUR AWS SECRET ACCESS KEY',
      "AWS_BUCKET_NAME":'ENTER YOUR AWS BUCKET NAME',
      "AWS_S3_URL":'ENTER YOUR AWS S3 URL',
      "LOGGLY_TOKEN":'ENTER YOUR LOGGLY TOKEN',
      "LOGGLY_SUBDOMAIN":'ENTER YOUR LOGGLY SUB DOMAIN',
      "LOGGLY_TAGS":'ENTER YOUR LOGGLY TAGS',
      "EXPRESS_SESSION_SECRET":'ENTER YOUR EXPRESS SESSION SECRET',
      "EXPRESS_SESSION_NAME":'ENTER YOUR EXPRESS SESSION NAME',
      "FACEBOOK_OAUTH_CALLBACK_URL":'ENTER YOUR FACEBOOK OAUTH CALLBACK URL',
      "FACEBOOK_APP_ID":'ENTER YOUR FACEBOOK APP ID',
      "FACEBOOK_APP_SECRET":'ENTER YOUR FACEBOOK APP SECRET',
      "TEKTOCS_API_BASE_URL":'ENTER THE API BASE URL'
    },
  }, function(err) {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');

    // Display logs in standard output 
    pm2.launchBus(function(err, bus) {
      console.log('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
       console.log('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', function(packet) {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });

  });
});

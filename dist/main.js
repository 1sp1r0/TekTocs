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
      "SOCKETIO_ADDRESS": "https://tektocs.herokuapp.com",
      "SLASH_COMMAND_VERIFICATION_TOKEN": "fjWWmrZt2kqSCrpkFYrVE5iU",
      "SLACK_BOT_ACCESS_TOKEN":'xoxb-20370276500-oiYPAV9nGQA3ic4AKrlJanlS',
      "SLACK_TEAM_ACCESS_TOKEN":"xoxp-2605154976-2605154980-20366174116-297e0ed68c",
      "SLACK_CLIENT_ID":'2605154976.20361890802',
      "SLACK_CLIENT_SECRET":'5467921f878c4f13496d11b41623a221',
      "MONGOLAB_URI" : 'mongodb://heroku_pxgrqk35:u45fmu7pharj20eiemaet23mj7@ds059205.mongolab.com:59205/heroku_pxgrqk35',
      "AWS_ACCESS_KEY_ID": 'AKIAI5OLC46GOPIPC3ZQ',
      "AWS_SECRET_ACCESS_KEY":'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',
      "AWS_BUCKET_NAME":'tektocs',
      "AWS_S3_URL":'https://s3.amazonaws.com',
      "LOGGLY_TOKEN":'e543bff0-e362-4527-9b8b-9b96cca8923a',
      "LOGGLY_SUBDOMAIN":'tektoks',
      "LOGGLY_TAGS":'Winston-NodeJS',
      "EXPRESS_SESSION_SECRET":'t3kt0cs1sn01',
      "EXPRESS_SESSION_NAME":'tektocsSessionId',
      "FACEBOOK_OAUTH_CALLBACK_URL":'http://localhost:8080/auth/facebook/callback',
      "FACEBOOK_APP_ID":'',
      "FACEBOOK_APP_SECRET":''
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

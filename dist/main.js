var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
  pm2.start({
    script    : 'dist/www/app.js',
    name      : 'tektocs',     
    exec_mode : 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances : instances,
    max_memory_restart : maxMemory + 'M',   // Auto restart if process taking more than XXmo
    env: {                            // If needed declare some environment variables
      "NODE_ENV": "production",
      "SOCKETIO_ADDRESS": "https://tektocs.herokuapp.com",
      "SLASH_COMMAND_VERIFICATION_TOKEN": "fjWWmrZt2kqSCrpkFYrVE5iU",
      "OBVUIS_SLACK_BOT_USER_TOKEN":'xoxb-20372567703-nlvqb9JKINFwJ3nobkWouH3i',
      "SLACK_CLIENT_ID":'2605154976.20361890802',
      "SLACK_CLIENT_SECRET":'5467921f878c4f13496d11b41623a221',
      "MONGOLAB_URI" : 'mongodb://heroku_pxgrqk35:u45fmu7pharj20eiemaet23mj7@ds059205.mongolab.com:59205/heroku_pxgrqk35'
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

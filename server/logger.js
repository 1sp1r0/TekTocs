import winston from 'winston';
require('winston-loggly');
 
 winston.add(winston.transports.Loggly, {
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    tags: [process.env.LOGGLY_TAGS],
    json:true
});

export default winston;
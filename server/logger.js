import winston from 'winston';
require('winston-loggly');
 
 winston.add(winston.transports.Loggly, {
    token: "e543bff0-e362-4527-9b8b-9b96cca8923a",
    subdomain: "tektoks",
    tags: ["Winston-NodeJS"],
    json:true
});

export default winston;
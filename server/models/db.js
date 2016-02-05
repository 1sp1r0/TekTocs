import mongoose from 'mongoose'
import winston from '../logger'

export default class DbConnection{
    
    static connect(){
       
        mongoose.connect(process.env.MONGOLAB_URI);
        
        mongoose.connection.on('connected', function () {
            winston.log('info','Mongoose connection opened.');
        });

        
        mongoose.connection.on('error',function (err) {
            winston.log('error','Mongoose connection error: ' + err);
        });

        
        mongoose.connection.on('disconnected', function () {
            winston.log('info','Mongoose connection disconnected.');
        });


        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                winston.log('info','Mongoose connection disconnected during app shutdown.');
                process.exit(0);
            });
        });
    }

}
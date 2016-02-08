import mongoose from 'mongoose'
import winston from '../logger'

export default class DbConnection{
    
    static connect(){
       
        mongoose.connect(process.env.MONGOLAB_URI);
        
        mongoose.connection.on('connected', function () {
            
        });

        
        mongoose.connection.on('error',function (err) {
            winston.log('error','Mongoose connection error: ' + err);
        });

        
        mongoose.connection.on('disconnected', function () {
            
        });


        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                process.exit(0);
            });
        });
    }

}
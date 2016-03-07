import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon';
import * as slashcommands from '../server/www/routehandlers/slashcommands'
import winston from '../server/logger'
import tag from '../server/helpers/tag'
import config from '../server/config'

chai.should();
chai.use(sinonChai);

let expect=chai.expect;
let assert=chai.assert;

sinon.config = {
  useFakeTimers: false
};

describe('SlashCommands', () =>{
    describe('start', ()=>{
        
        beforeEach(function () {
            
        });

        afterEach(function () {
            
        });
        
        it('should not execute for invalid slash command verification token', sinon.test(function(){
            let res={}, req ={body: {token:'some dummy token'}};
            let log=this.stub(winston,'log');
            slashcommands.start(req,res);
            log.restore();
            log.should.have.been.calledWith('warn', tag`unauthorizedSlashCommandAccess`);
        }));
        
        it('should prompt for slideshow title when not supplied', sinon.test(function(){
            //console.log(tag`noUnpublishedSlideshowsFound${'muraliteam'}${'murali'}` );
            let stubforSend=this.stub();
            let res={send:stubforSend}, req ={app:{
                                slackbot:{
                                    slack:{}
                             }},body: {token:process.env.SLASH_COMMAND_VERIFICATION_TOKEN,text:''}};
            let status=res.status=this.stub().returns(res);
            slashcommands.start(req,res);
            stubforSend.should.have.been.calledWith(tag`slideshowRequiresTitle`);
        }));
    });
});
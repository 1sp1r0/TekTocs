import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon';
import * as slashcommands from '../server/www/routehandlers/slashcommands'
import winston from '../server/logger'
import tag from '../server/helpers/tag'
import config from '../server/config'
import * as Models from '../server/models/'
import * as slackhelper from '../server/helpers/slackhelper'

chai.should();
chai.use(sinonChai);

let expect=chai.expect;
let assert=chai.assert;

sinon.config = {
  useFakeTimers: false
};

describe('SlashCommands', () =>{
    describe('start', ()=>{
        let req,res,send,status,log,findSlackTeamStub;
        beforeEach(function () {
            log=sinon.stub(winston,'log');
            res={};
            send=res.send=sinon.stub();
            status=res.status=sinon.stub().returns(res);
            findSlackTeamStub=sinon.stub(Models.SlackTeam,'findOne')
                              .returns(Promise.resolve(new Models.SlackTeam()));
           req ={
                 app:{
                        slackbot:{
                            slack:{}
                        }
                 },
                 body: {
                            token:process.env.SLASH_COMMAND_VERIFICATION_TOKEN,
                            text:'slideShowTitle'
                        }
                };
        });

        afterEach(function () {
            log.restore();
            Models.SlackTeam.findOne.restore();
        });
        
        it('should not execute for invalid slash command verification token', sinon.test(function(){
            req ={body: {token:'some dummy token'}};
            slashcommands.start(req,res);
            log.restore();
            log.should.have.been.calledWith('warn', tag`unauthorizedSlashCommandAccess`);
        }));
        
        it('should prompt for slideshow title when not supplied', sinon.test(function(){
            req.body.text='';
            slashcommands.start(req,res);
            send.should.have.been.calledWith(tag`slideshowRequiresTitle`);
        }));
        
        it('should stop executing if Slackteam for the given team id cannot be found', 
        sinon.test(function(done){
            findSlackTeamStub.returns(Promise.resolve(null));
            slashcommands.start(req,res);
            done();
            send.should.have.been.calledWith(tag`somethingDoesntSeemToBeRight`);
            
        }));
        
    });
});
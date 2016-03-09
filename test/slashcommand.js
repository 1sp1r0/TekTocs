import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import mockery from 'mockery'
import proxyquire from 'proxyquire'
import co from 'co'
import * as slashcommands from '../server/www/routehandlers/slashcommands'
import winston from '../server/logger'
import tag from '../server/helpers/tag'
import config from '../server/config'
import * as Models from '../server/models/'
import * as slackhelper from '../server/helpers/slackhelper'
import slashCommandMock from './mocks/slashcommandmock'
import slackTeamMock from './mocks/slackteammock'

chai.should();
chai.use(sinonChai);

let expect=chai.expect;
let assert=chai.assert;

sinon.config = {
  useFakeTimers: false
};

describe('SlashCommands', () =>{
    describe('start', ()=>{
        
        let req,res,send,status,log,
        findSlackTeamStub,openImStub,findSlackUserStub,
        findUserInfoStub,updateUserStub,postMessageToSlackStub;
        beforeEach(function () {
            res={};
            send=res.send=sinon.stub();
            status=res.status=sinon.stub().returns(res);
            log=sinon.stub(winston,'log');
            //slashcommands = proxyquire('../server/www/routehandlers/slashcommands', { '../../models/': {}});
                //.returns({findOne:function(){return Promise.resolve(new Models.SlackTeam())}});
            //mockery.enable({useCleanCache: true});
            //mockery.registerMock('../server/models/', slashCommandMock);
            //mockery.registerMock('../server/models/slackteam', slackTeamMock);
            findSlackTeamStub=sinon.stub(Models.SlackTeam,'findOne')
                              .returns(new Promise((resolve,reject) => {resolve(new Models.SlackTeam());}));
            openImStub=sinon.stub(slackhelper, 'openIm')
                              .returns(new Promise((resolve,reject) => {resolve("{\"ok\":true}");}));   
            findUserInfoStub=sinon.stub(slackhelper,'getUserinfo')
                                .returns(Promise.resolve({ok:true,user:{upserted:[{_id:1}]}}));    
            findSlackUserStub=sinon.stub(Models.SlackUser,'findOne')
                              .returns(Promise.resolve({_id:1}));     
            updateUserStub=  sinon.stub(Models.SlackUser,'update')
                                .returns(Promise.resolve({ok:true,user:{upserted:[{_id:1}]}})); 
            postMessageToSlackStub=sinon.stub(slackhelper,'postMessageToSlack')
                                .returns(Promise.resolve({ok:true}));                                                              
           req ={
                 app:{
                        slackbot:{
                            slack:{login:function(){return true;}}
                        }
                 },
                 body: {
                            token:process.env.SLASH_COMMAND_VERIFICATION_TOKEN,
                            text:'slideShowTitle',
                            team_id:'dummy'
                        }
                };
        });

        afterEach(function () {
            log.restore();
            //mockery.deregisterAll();
            //mockery.disable();
            findSlackTeamStub.restore();
            openImStub.restore();
            findUserInfoStub.restore();
            findSlackUserStub.restore();
            updateUserStub.restore();
            postMessageToSlackStub.restore();
        });
        
        it('should not execute for invalid slash command verification token.', sinon.test(function(){
            req ={body: {token:'some dummy token'}};
            slashcommands.start(req,res);
            log.restore();
            log.should.have.been.calledWith('warn', tag`unauthorizedSlashCommandAccess`);
        }));
        
        it('should prompt for slideshow title when not supplied.', sinon.test(function(){
            req.body.text='';
            slashcommands.start(req,res);
            send.should.have.been.calledWith(tag`slideshowRequiresTitle`);
        }));
        
       it('should stop executing if Slackteam for the given team id cannot be found.', 
        sinon.test(
            function (){
                findSlackTeamStub.returns(Promise.resolve(null));
                return co(function * () {
                    yield Promise.resolve(slashcommands.start(req,res));
                    status.should.have.been.calledWith(500);
                    send.should.have.been.calledWith(tag`somethingDoesntSeemToBeRight`);
             });
        }));
      
      it('should stop executing if a Slack DM Channel with tektocs cannot be opened.', 
        sinon.test(
            function(){
                openImStub.returns(Promise.resolve("{\"ok\":false}"));
                return co(function * () {
                    yield Promise.resolve(slashcommands.start(req,res));
                    status.should.have.been.calledWith(500);
                    send.should.have.been.calledWith(tag`couldNotOpenDMChannelWithBot`);
               });
        }));
        /*
        it('should stop executing if the slack user info cannot be retrieved.', 
        sinon.test(function(done){
            findSlackUserStub.returns(Promise.resolve(null));
            findUserInfoStub.returns(Promise.resolve({ok:false}));                    
            slashcommands.start(req,res);
            done();
            send.should.have.been.calledWith(tag`couldNotRetriveUserInfo`);
            
        }));
        
        it('should stop executing if there is an error posting message to slack.', 
        sinon.test(function(done){
            postMessageToSlackStub.returns(Promise.resolve({ok:false}));                    
            slashcommands.start(req,res);
            done();
            send.should.have.been.calledWith(tag`troubleWakingUpBot`);
        }));
        
         it('should send a response indicating that slides can now be added to the slideshow.', 
        sinon.test(function(done){
            slashcommands.start(req,res);
            done();
            send.should.have.been.calledWith(tag`readyToAddSlides`);
        }));*/
        
    });
});
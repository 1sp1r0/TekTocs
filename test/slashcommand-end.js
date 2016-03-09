import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import co from 'co'
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

describe('SlashCommand', () =>{
    describe('end', ()=>{
        
        let req,res,query,send,status,sendStatus,log,
        findSlackTeamStub,getSlideshowEndingTimestampStub,findOneAndUpdateStub,
        findUserInfoStub,updateUserStub,postMessageToSlackStub;
        beforeEach(function () {
            query={exec:function(){return Promise.resolve(true);}};
            res={};
            send=res.send=sinon.stub();
            status=res.status=sinon.stub().returns(res);
            sendStatus=res.sendStatus=sinon.stub();
            log=sinon.stub(winston,'log');
            findSlackTeamStub=sinon.stub(Models.SlackTeam,'findOne')
                              .returns(Promise.resolve(new Models.SlackTeam()));
                              
            getSlideshowEndingTimestampStub=sinon.stub(slackhelper, 'getSlideshowEndingTimestamp')
                              .returns(Promise.resolve("some timestamp"));   
            findUserInfoStub=sinon.stub(slackhelper,'getUserinfo')
                                .returns(Promise.resolve("{\"ok\":true,\"user\":{\"upserted\":[{\"_id\":1}]}}"));    
            findOneAndUpdateStub=sinon.stub(Models.SlashCommand,'findOneAndUpdate')
                              .returns(query);     
            updateUserStub=  sinon.stub(Models.SlackUser,'update')
                                .returns(Promise.resolve({ok:true,user:{upserted:[{_id:1}]}})); 
            postMessageToSlackStub=sinon.stub(slackhelper,'postMessageToSlack')
                                .returns(Promise.resolve("{\"ok\":true,\"ts\":\"some time stamp\"}"));                                                              
           
           
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
            findSlackTeamStub.restore();
            getSlideshowEndingTimestampStub.restore();
            findUserInfoStub.restore();
            findOneAndUpdateStub.restore();
            updateUserStub.restore();
            postMessageToSlackStub.restore();
        });
        
        it('should not execute for invalid slash command verification token.', sinon.test(function(){
            req ={body: {token:'some dummy token'}};
            slashcommands.end(req,res);
            log.restore();
            log.should.have.been.calledWith('warn', tag`unauthorizedSlashCommandAccess`);
        }));
        
       
        
       it('should stop executing if Slackteam for the given team id cannot be found.', 
        sinon.test(
            function (){
                findSlackTeamStub.returns(Promise.resolve(null));
                return co(function * () {
                    yield Promise.resolve(slashcommands.end(req,res));
                    status.should.have.been.calledWith(500);
                    send.should.have.been.calledWith(tag`somethingDoesntSeemToBeRight`);
             });
        }));
        
        it('should send a 200 OK response.', 
        sinon.test(
            function(){
                return co(function * () {  
                    yield Promise.resolve(slashcommands.end(req,res));
                    sendStatus.should.have.been.calledWith(200);
                });
        }));
      
     /* it('should stop executing if a Slack DM Channel with tektocs cannot be opened.', 
        sinon.test(
            function(){
                openImStub.returns(Promise.resolve("{\"ok\":false}"));
                return co(function * () {
                    yield Promise.resolve(slashcommands.start(req,res));
                    status.should.have.been.calledWith(500);
                    send.should.have.been.calledWith(tag`couldNotOpenDMChannelWithBot`);
               });
        }));
        
        it('should stop executing if the slack user info cannot be retrieved.', 
        sinon.test(
            function(){
                findSlackUserStub.returns(Promise.resolve(null));
                findUserInfoStub.returns(Promise.resolve("{\"ok\":false}")); 
                return co(function * () {                   
                    yield Promise.resolve(slashcommands.start(req,res));
                    send.should.have.been.calledWith(tag`couldNotRetriveUserInfo`);
                });
        }));
        
        it('should stop executing if there is an error posting message to slack.', 
        sinon.test(
            function(){
                postMessageToSlackStub.returns(Promise.resolve("{\"ok\":false}"));  
                return co(function * () {                       
                    yield Promise.resolve(slashcommands.start(req,res));
                    status.should.have.been.calledWith(500);
                    send.should.have.been.calledWith(tag`troubleWakingUpBot`);
                });
        }));*/
        
      /*   it('should send a response indicating that slides can now be added to the slideshow.', 
        sinon.test(
            function(){
                return co(function * () {  
                    yield Promise.resolve(slashcommands.start(req,res));
                    send.should.have.been.calledWith(tag`readyToAddSlides`);
                });
        }));*/
        
    });
});
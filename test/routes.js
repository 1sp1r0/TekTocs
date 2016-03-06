import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon';
import routeHandlerMappings from '../server/www/routehandlermappings';

chai.should();
chai.use(sinonChai);

let expect=chai.expect;
let assert=chai.assert;

sinon.config = {
  useFakeTimers: false
};

describe('Routes', () =>{
    describe('/', ()=>{
        
        
        beforeEach(function () {
            
        });

        afterEach(function () {
            
        });

        it('GET should be handled by index', sinon.test(function(){
            let handler=routeHandlerMappings['/'].get;
            expect(handler.name).to.equal('index');
        }));
        
        it('GET should render index view',sinon.test(function(){
            let res={}, req ={};
            let stub=res.render= this.stub();
            let handler=routeHandlerMappings['/'].get;
            handler(req,res);
            stub.should.have.been.calledOnce;
            stub.should.have.been.calledWith('index');
        }));
        
        it('POST should not be allowed', sinon.test(function(){
            let handler=routeHandlerMappings['/'].post;
            expect(handler).to.equal(undefined);
        }));
        
        it('PUT should not be allowed', sinon.test(function(){
            let handler=routeHandlerMappings['/'].put;
            expect(handler).to.equal(undefined);
        }));
        
        it('DELETE should not be allowed', sinon.test(function(){
            let handler=routeHandlerMappings['/'].delete;
            expect(handler).to.equal(undefined);
        }));
        
    });
});
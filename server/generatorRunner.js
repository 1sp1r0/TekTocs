export default class GeneratorRunner {
    
  runCallbackGenerator(gen) {
    let iterator = gen();

     function callback(...args) {
            let nextResult = iterator.next(args);
            if (nextResult.done) return;
            nextResult.value(callback);
      }
      callback();
    }


 runPromiseGenerator(gen){
    let iterator=gen();
    
    function successHandler(result){
        let nextResult=iterator.next(result);
        if(nextResult.done){
            return ;
        }
        nextResult.value.then(successHandler);
    }
   
    successHandler();
  }

}
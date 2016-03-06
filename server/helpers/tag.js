import config from '../config'

    export default function tag(strings,...values){
        if(strings && strings.length>0){
           let configValue=config[strings[0]]; 
           if(typeof configValue === 'function'){ 
            return config[strings[0]](...values);
           }
           else
           {
               return config[strings[0]];
           }
    }
    
}


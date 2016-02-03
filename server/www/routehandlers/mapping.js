import * as homeRouteHandlers from './home'


let routeHandlerMappings={};

routeHandlerMappings["/"]={get:homeRouteHandlers.index};


export default routeHandlerMappings;
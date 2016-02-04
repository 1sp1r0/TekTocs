import * as homeRouteHandlers from './home'
import * as authRouteHandlers from './auth'


let routeHandlerMappings={};

routeHandlerMappings["/"]={get:homeRouteHandlers.index};
routeHandlerMappings["/slackoauth"]={get:authRouteHandlers.slackoauth};

export default routeHandlerMappings;
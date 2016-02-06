import * as handlers from './routehandlers/'

let routeHandlerMappings={};

routeHandlerMappings["/"]={get:handlers.home_index};
routeHandlerMappings["/slack/oauth"]={get:handlers.oauth};
routeHandlerMappings["/slack/command"]={post:handlers.command};
export default routeHandlerMappings;
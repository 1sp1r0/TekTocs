import * as handlers from './routehandlers/'

let routeHandlerMappings={};

routeHandlerMappings["/"]={get:handlers.home_index};
routeHandlerMappings["/slack/oauth"]={get:handlers.oauth};
routeHandlerMappings["/slack/command"]={post:handlers.command};
routeHandlerMappings["/slack/commands/startlive"]={post:handlers.startLive};
export default routeHandlerMappings;
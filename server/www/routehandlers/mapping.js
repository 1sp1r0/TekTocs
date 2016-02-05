import * as homeRouteHandlers from './home'
import * as slackRouteHandlers from './slack'


let routeHandlerMappings={};

routeHandlerMappings["/"]={get:homeRouteHandlers.index};
routeHandlerMappings["/slack/oauth"]={get:slackRouteHandlers.oauth};
routeHandlerMappings["/slack/command"]={post:slackRouteHandlers.command};
export default routeHandlerMappings;
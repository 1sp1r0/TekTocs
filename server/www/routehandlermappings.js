import * as handlers from './routehandlers/'

let routeHandlerMappings={};

routeHandlerMappings["/"]={get:handlers.home_index};
routeHandlerMappings["/slack/oauth"]={get:handlers.oauth};
routeHandlerMappings["/slack/command"]={post:handlers.command};
routeHandlerMappings["/slack/commands/startlive"]={post:handlers.startLive};
routeHandlerMappings["/slack/commands/start"]={post:handlers.start};
routeHandlerMappings["/slack/commands/end"]={post:handlers.end};
routeHandlerMappings["/slack/commands/publish"]={post:handlers.publish};
routeHandlerMappings["/slideshows/:team/:user"]={get:handlers.userSlideshows};
routeHandlerMappings["/slideshows/:team/:user/:slideshow"]={get:handlers.userSlideshow};
export default routeHandlerMappings;
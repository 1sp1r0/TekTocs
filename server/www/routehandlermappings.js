import * as handlers from './routehandlers/'

let routeHandlerMappings={};

routeHandlerMappings["/"]={get:handlers.home_index};
routeHandlerMappings["/slack/oauth"]={get:handlers.oauth};
routeHandlerMappings["/slack/command"]={post:handlers.command};
routeHandlerMappings["/slack/commands/startlive"]={post:handlers.startLive};
routeHandlerMappings["/slack/commands/start"]={post:handlers.start};
routeHandlerMappings["/slack/commands/end"]={post:handlers.end};
routeHandlerMappings["/slack/commands/publish"]={post:handlers.publish};
routeHandlerMappings["/slideshows/:user"]={get:handlers.userSlideshows};
routeHandlerMappings["/slideshows/:user/:slideshow"]={get:handlers.userSlideshow};
routeHandlerMappings["/api/:user/:slideshow"]={get:handlers.getUserSlideshow};
routeHandlerMappings["/api/:user/"]={get:handlers.getUserSlideshows};
export default routeHandlerMappings;
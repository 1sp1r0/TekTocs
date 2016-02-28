
import React from 'react';
import ReactDOM from  'react-dom';
import Slideshow from '../server/components/slideshow.jsx';
import * as Components from '../server/components/slideshowlist.jsx';
import SlackUser from '../server/components/slackuser.jsx';

export function renderSlideshow(targetElementId,userid,slideshowid) {
    let SlideShowComponent = React.createFactory(Slideshow);
    ReactDOM.render(SlideShowComponent({userid:userid,slideshowid:slideshowid}), 
    document.getElementById(targetElementId));
}

export function renderSlideshowlist(targetElementId,userid) {
    let SlideShowListComponent = React.createFactory(Components.SlideshowList);
    ReactDOM.render(SlideShowListComponent({userid:userid}), 
    document.getElementById(targetElementId));
}

export function renderSlackUser(targetElementId,userid) {
    let SlackUserComponent = React.createFactory(SlackUser);
    ReactDOM.render(SlackUserComponent({userid:userid}), 
    document.getElementById(targetElementId));
}

if(module.hot){
    module.hot.accept();
}

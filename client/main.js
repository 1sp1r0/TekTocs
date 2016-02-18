

import React from 'react';
import ReactDOM from  'react-dom';
import Slideshow from '../server/components/slideshow.jsx';

export function renderSlideshow(targetElementId,userid,slideshowid) {
    let SlideShowComponent = React.createFactory(Slideshow);
    ReactDOM.render(SlideShowComponent({userid:userid,slideshowid:slideshowid}), 
    document.getElementById(targetElementId));
}
if(module.hot){
    module.hot.accept();
}
import React from 'react';
import ReactDOM from  'react-dom';
import Slideshow from './components/slideshow.jsx';

renderSlideshow('test','#{userid}','#{slideshowid}');

function renderSlideshow(targetElementId,userid,slideshowid) {
    ReactDOM.render(<Slideshow userid={userid} slideshowid={slideshowid} />, document.getElementById(targetElementId));
}
if(module.hot){
    module.hot.accept();
}
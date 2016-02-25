import React from 'react';
import ReactDOM from  'react-dom/server';
import Slideshow from '../../components/slideshow';
import * as Components from '../../components/slideshowlist';

function userSlideshows (req,res){
    let SlideshowListComponent = React.createFactory(Components.SlideshowList);
    res.render('slideshows/user',{userid:req.params.userid,
    react: ReactDOM.renderToString(SlideshowListComponent({userid: req.params.userid}))
    });
}

function userSlideshow (req,res){
    let SlideShowComponent = React.createFactory(Slideshow);
    //res.render('slideshows/slideshow',{userid: req.params.userid,
    //slideshowid:req.params.slideshowid});
    
    res.render('slideshows/slideshow',
    {userid: req.params.userid,slideshowid:req.params.slideshowid,
    react: ReactDOM.renderToString(SlideShowComponent({userid: req.params.userid,
    slideshowid:req.params.slideshowid}))
  });
}

export {userSlideshows,userSlideshow};
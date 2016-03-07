import React from 'react';
import ReactDOM from  'react-dom/server';
import Slideshow from '../../components/slideshow';
import * as Components from '../../components/slideshowlist';
import SlackUser from '../../components/slackuser';

export function userSlideshows (req,res){
    let SlideshowListComponent = React.createFactory(Components.SlideshowList);
    let SlackUserComponent = React.createFactory(SlackUser);
    res.render('slideshows/user',{userid:req.params.userid,
    react: ReactDOM.renderToString(SlideshowListComponent({userid: req.params.userid})),
    'react-user-component':ReactDOM.renderToString(SlackUserComponent({userid: req.params.userid}))
    });
}

export function userSlideshow (req,res){
    let SlideShowComponent = React.createFactory(Slideshow);
    res.render('slideshows/slideshow',
    {userid: req.params.userid,slideshowid:req.params.slideshowid,
    react: ReactDOM.renderToString(SlideShowComponent({userid: req.params.userid,
    slideshowid:req.params.slideshowid}))
  });
}

export function userLiveSlideshow (req,res){
    let SlideShowComponent = React.createFactory(Slideshow);
    res.render('slideshows/live',
    {userid: req.params.userid,slideshowid:req.params.slideshowid,
    react: ReactDOM.renderToString(SlideShowComponent({userid: req.params.userid,
    slideshowid:req.params.slideshowid}))
  });
}


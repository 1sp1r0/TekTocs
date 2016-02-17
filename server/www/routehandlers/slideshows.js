import React from 'react';
import ReactDOM from  'react-dom/server';
import Slideshow from '../../components/slideshow.jsx';

function userSlideshows (req,res){
    res.render('slideshows/user',{userid:req.params.userid});
}

function userSlideshow (req,res){
    let SlideShowComponent = React.createFactory(Slideshow);
    res.render('slideshows/slideshow',
    {
    react: 'Hello'
  });
}

export {userSlideshows,userSlideshow};
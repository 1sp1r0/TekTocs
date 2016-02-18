import React from 'react';
import ReactDOM from  'react-dom/server';
import Slideshow from '../../components/slideshow';

function userSlideshows (req,res){
    res.render('slideshows/user',{userid:req.params.userid});
}

function userSlideshow (req,res){
    let SlideShowComponent = React.createFactory(Slideshow);
    res.render('slideshows/slideshow',{userid: req.params.userid,
    slideshowid:req.params.slideshowid});
    //{
    //react: ReactDOM.renderToString(SlideShowComponent({userid: req.params.userid,
    //slideshowid:req.params.slideshowid}))
  }
  //);
//}

export {userSlideshows,userSlideshow};
function userSlideshows (req,res){
    res.render('slideshows/user',{userid:req.params.userid});
}

function userSlideshow (req,res){
    res.render('slideshows/slideshow',{userid:req.params.userid,slideshowid:req.params.slideshowid});
}

export {userSlideshows,userSlideshow};
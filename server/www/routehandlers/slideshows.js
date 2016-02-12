function userSlideshows (req,res){
    res.render('slideshows/user',{team:req.params.team,user:req.params.user});
}

function userSlideshow (req,res){
    res.render('slideshows/slideshow',{team:req.params.team,user:req.params.user,slideshow:req.params.slideshow});
}

export {userSlideshows,userSlideshow};
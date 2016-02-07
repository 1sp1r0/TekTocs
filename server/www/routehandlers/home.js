
function index (req,res){
    console.log(req.app.slackbot.slack);
    res.render('index',{});
}

export {index};
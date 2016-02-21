import React from 'react';
//import $ from 'jquery';
//import * as slackhelper from '../helpers/slackhelper'
//import co from 'co'
//import winston from '../logger'

//import * as Models from '../models/'
//import "babel-polyfill"


export default class Slideshow extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
      this.setState({data:{name:'',
      coverslide:{isImage:true},
      'mimeType':'image/jpeg',createDateText:'',
      slideshow:{title:'',creator:{image_32:''}}
      }});
      /*self.setState({data:{"_id":"56c48c712e72031300da30ad","attachments":{"slideshow":{"end_ts":"1455721625.000064","start_ts":"1455721584.000058","title":"test123qwqwqwq","short_id":"VJZqsdTcg","creator":{"_id":"4yCptPn5e","user_id":"U02HT4JUU","name":"murali","image_192":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F7fa9%2Fimg%2Favatars%2Fava_0000-192.png","image_72":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-72.png","image_48":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-48.png","image_32":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-32.png","image_24":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-24.png","email":"murali@agateconsulting.com","real_name":"Murali Narasimhan","last_name":"Narasimhan","first_name":"Murali"},"published":true,"slides":[{"_id":"56c48c9f8179df240033aeea","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test123","slideIndex":1},{"_id":"56c48c9f8179df240033aeeb","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test456","slideIndex":2},{"_id":"56c48c9f8179df240033aeec","slideMode":"hosted","slideMimeType":"image/jpeg","slideTitle":"bg1.jpg","slideAssetUrl":"https://files.slack.com/files-pri/T02HT4JUQ-F0MNY1Z52/download/bg1.jpg","slideCaption":"","slideText":"","slideIndex":3},{"_id":"56c48c9f8179df240033aeed","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test789","slideIndex":4}]}}}});*/
       
      
      
   /*   var self=this;
      
            
            let result=slackhelper.getUserSlideshow(this.props.userid,this.props.slideshowid).then(
                function(result){
                    console.log(result.attachments.slideshow);
                    self.setState({data: result}); 
                    
                },
                function(error){
                    console.log(error);
                    winston.log('error', error);
                });
      */
    
  }
  
   componentDidMount() {
       let self=this;
       
       $.ajax({
      url: 'https://tektocs.herokuapp.com/api/' + self.props.userid + '/' + self.props.slideshowid, //this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({data: data});
        
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });
   }
   
   
    render() {
        
        if(this.state.data.slideshow){
            //let name=(this.state.data.attachments.slideshow.creator.real_name?
            //      this.state.data.attachments.slideshow.creator.real_name:
            //      (this.state.data.attachments.slideshow.creator.name?
            //      this.state.data.attachments.slideshow.creator.name:''));
             let coverSlide=<div className='tux-loading-indicator text-center'/>;
             
              //the first slide is the cover slide/title slide.Retrieve the cover slide
             /* if(this.state.data.attachments.slideshow.slides.length>0){
                  let mimeType=this.state.data.attachments.slideshow.slides[0].slideMimeType;
                  slackhelper.getCoverSlide(this.state.data.attachments.slideshow.slides[0],
                  this.state.data.team_id).then(
                      function(result){
                         if(result.isImage){
                           coverSlide=(<div class='item active'>
                                            <img src='data:{mimeType};base64,{result.base64}'/>
                                       </div>);  
                           console.log(coverSlide);            
                         }else{
                             coverSlide=(<div className="item active slideContainer">
                                            <div className="slide">{result.text}</div>
                                         </div>);
                             console.log(coverSlide);            
                         }
                      }
                  );
              } */  
              if(this.state.data.coverslide.isImage){
                  if(this.state.data.coverslide.src){
                      //let imgSrc='data:' + this.state.data.mimeType + ';base64,' + this.state.data.coverslide.base64;
                      coverSlide=(<div className='item active'>
                                <img src={this.state.data.coverslide.src} />
                             </div>); 
                  }
              }else{
                coverSlide=(<div className="item active slideContainer">
                                <div className="slide">{this.state.data.coverslide.text}</div>
                            </div>);
               }
            return <div className='jumbotron'>
                        <div className='jumbotron-contents'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='floatLeft'>
                                        <div className='avatar-container'>
                                            <a className='avatar'>
                                                <img className='avatar-image' src={this.state.data.slideshow.creator.image_32} />
                                            </a>
                                        </div>    
                                        <div className='userinfo'>
                                             <a>{this.state.data.name}</a>
                                             <span className='userinfo-extra'>{this.state.data.createDateText}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='slideshow-title'>{this.state.data.slideshow.title}</div> 
                        </div>
                        <div className='carousel' id='slideshow-carousel'>
                             <div className='carousel-inner' role='listbox'>
                                {coverSlide}
                             </div>
                        </div>
                   </div>
       
        }else {
             return <div></div>
                    
        }
        
    }
    
  /*  getUserSlideshow(){
    return new Promise((resolve, reject) => {    
    try{
        let self=this;
        co(function* () {
           try{
                let userid=self.props.userid;
                let slideshowid=self.props.slideshowid;
                let slideshow = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                        resolve(slideshow);
             }catch (err) {
                  reject(err.stack);
             }
       }).catch((err) => {
            reject(err.stack);
      });
    }catch (err) {
        reject(err.message);
    }
    });
}*/
};
import React from 'react';
import $ from 'jquery';
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
      console.log('componentWillMount');
     /* let result=this.getUserSlideshow().then(
          function(result){
              console.log(result.attachments.slideshow);
              this.setState({data: result}); 
          },
          function(error){
              console.log(error);
              winston.log('error', error);
          });*/
     
    /*$.ajax({
      url: 'https://tektocs.herokuapp.com/api/' + self.props.userid + '/' + self.props.slideshowid, //this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({data: data});
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });*/
  }
   componentDidMount() {
       let self=this;
       console.log('componentDidMount');
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
        console.log('render:' + this.state.data);
        if(this.state.data.attachments){
        return <div className='commentBox' >
                    <h1>{this.state.data.attachments.slideshow.title}</h1>
                    
                    
               </div>
        }else {
            return <div className='commentBox' >
                    <h1></h1>
                    
                    
               </div>
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
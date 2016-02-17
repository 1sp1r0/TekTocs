import React from 'react';
//import $ from 'jquery';
import co from 'co'
import winston from '../../logger'

import * as Models from '../../models/'
import "babel-polyfill"


export default class Slideshow extends React.Component{
    
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
    this.setState({data: getUserSlideshow()}); 
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
    render() {
        return <div className='commentBox'>
                    <h1>{this.state.data.attachments.slideshow.title}</h1>
                    
                    
               </div>
        
    }
    
    getUserSlideshow (){
    try{
        co(function* () {
           try{
                let userid=this.props.userid;
                let slideshowid=this.props.slideshowid;
                let slideshow = yield Models.SlashCommand.findOne({ 
                        'attachments.slideshow.published':true,
                        'attachments.slideshow.creator': userid, 
                        'attachments.slideshow.short_id':slideshowid},{'attachments.slideshow':1})
                        .populate('attachments.slideshow.creator')
                        .exec();
                return {ok:true, data:slideshow};
             }catch (err) {
                    winston.log('error', err.stack);
                    return{ok:false};
             }
       }).catch((err) => {
            winston.log('error', err.stack);
            return{ok:false};
      });
    }catch (err) {
        winston.log('error',err.message);
        return{ok:false};
    }
}
};
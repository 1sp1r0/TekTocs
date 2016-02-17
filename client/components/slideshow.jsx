import React from 'react';
import $ from 'jquery';


export default class Slideshow extends React.Component{
    
    
  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  componentDidMount() {
    var self=this;  
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
        return <div className='commentBox'>
                    <h1>{this.state.data.attachments.slideshow.title}</h1>
                    
                    
               </div>
        
    }
};
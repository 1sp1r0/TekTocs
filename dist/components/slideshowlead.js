/*import React from 'react';

export default class SlideshowLead extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
    self.setState({data: this.props.data});
  }
  
   componentDidMount() {
       self.setState({data: this.props.data});
   }
   

   
   render() {
       
        if(this.state.data.coverslide && this.state.data.slideshow){
           
            
             let coverSlide=<div />;
             if(this.state.data.coverslide.isImage){
                  if(this.state.data.coverslide.src){
                      coverSlide=(<div className='jumbotron-photo'>
                                <img src={this.state.data.coverslide.src} />
                             </div>); 
                  }
              }
            
             if(this.state.data.slideshow.slides.length>0){
                 var self=this;
                  slides=this.state.data.slideshow.slides.map(function(slide,index){
                      
                     if (slide.slideAssetUrl !='' && slide.slideMode!='snippet'){
                         
                        return (<div key={slide._id} className={`${index===0?'active':''} item`}>
                                <img src={slide.slideAssetUrl} />
                                <div className="slide">{slide.slideCaption}</div>
                             </div>);
                     }else{
                         if(slide.slideMode==='snippet'){
                             return (<div key={slide._id} className={`${index===0?'active':''} item slideContainer`}>
                                <div dangerouslySetInnerHTML={self.createMarkup(slide.slideText)} className="slide text-left"></div>
                            </div>);
                         }else{
                         return (<div key={slide._id} className={`${index===0?'active':''} item slideContainer`}>
                                <div className="slide">{slide.slideText}</div>
                            </div>);
                         }
                     }
                     
                     
                 });
             }
             
             
            return <div className='jumbotron'>
                        <div className='jumbotron-contents'>
                                    <div className='row'>
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            <div className='floatLeft'>
                                                <div className='avatar-container'>
                                                    <a className='avatar'>
                                                        <img className='avatar-image' src={this.state.data.slideshow.creator.image_32} />
                                                    </a>
                                                </div>    
                                                <div className='userinfo'>
                                                    <a>{this.state.data.name}</a>
                                                    <span className='userinfo-extra'>{this.state.data.createDateText} - {this.state.data.slideshow.slideCount} slides</span>
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                                   {coverSlide}
                                  <p className='slideshow-lead-title'>{this.state.data.slideshow.title}</p>   
                          
                        </div>
                       
                   </div>
                   
        }else {
             return <div></div>
                    
        }
        
    }
    
  
};*/
"use strict";
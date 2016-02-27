import React from 'react';

export default class SlackUser extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
      this.setState({data:{name:'',image:'',description:''}});
    
  }
  
   componentDidMount() {
       let self=this;
       
       $.ajax({
      url: 'https://tektocs.herokuapp.com/api/users/' + self.props.userid ,
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
   
   createMarkup(slideText) { return {__html: slideText.replace(/\r\n/g,'<br/>')}; }
   
   render() {
       
        if(this.state.data.name !=''){
           
             let coverSlide=<div className='tux-loading-indicator text-center'/>;
             let slides='';
            
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
             
              if(this.state.data.coverslide.isImage){
                  if(this.state.data.coverslide.src){
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
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
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
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            <div className='slideshow-title'>{this.state.data.slideshow.title}</div> 
                                       </div>
                            </div>
                              <div className='row visible-xs'>
                                <div className='col-xs-2'>
                                    <div className='slideshow-nav-button-left'>
                                    <a className='left pull-left' href='#slideshow-carousel' role='button' data-slide='prev'>
                                        <span className='glyphicon glyphicon-chevron-left' aria-hidden='true'/>
                                        <span className='sr-only'>Previous</span>
                                    </a>
                                    
                                    </div>
                                </div>
                                <div className='col-xs-8'>
                                    
                                </div>
                                  <div className='col-xs-2'>
                                    <div className='slideshow-nav-button-right'>
                                        <a className='right pull-right' href='#slideshow-carousel' role='button' data-slide='next'>
                                            <span className='glyphicon glyphicon-chevron-right' aria-hidden='true'/>
                                            <span className='sr-only'>Next</span>
                                        </a>
                                   </div>   
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-1 col-sm-1 hidden-xs'>
                                    <div className='slideshow-nav-button-left'>
                                    <a className='left pull-left' href='#slideshow-carousel' role='button' data-slide='prev'>
                                        <span className='glyphicon glyphicon-chevron-left' aria-hidden='true'/>
                                        <span className='sr-only'>Previous</span>
                                    </a>
                                    
                                    </div>
                                </div>
                                <div className='col-md-10 col-sm-10 col-xs-12 text-center'>
                                    <div  className='carousel' id='slideshow-carousel'>
                                        <div className='carousel-inner' role='listbox'>
                                              {slides}
                                          </div>
                                     </div>
                                </div>
                                  <div className='col-md-1 col-sm-1 hidden-xs'>
                                    <div className='slideshow-nav-button-right'>
                                        <a className='right pull-right' href='#slideshow-carousel' role='button' data-slide='next'>
                                            <span className='glyphicon glyphicon-chevron-right' aria-hidden='true'/>
                                            <span className='sr-only'>Next</span>
                                        </a>
                                    </div>   
                                </div>
                            </div>
                           <div className='row visible-xs'>
                                <div className='col-xs-2'>
                                    <div className='slideshow-nav-button-left'>
                                    <a className='left pull-left' href='#slideshow-carousel' role='button' data-slide='prev'>
                                        <span className='glyphicon glyphicon-chevron-left' aria-hidden='true'/>
                                        <span className='sr-only'>Previous</span>
                                    </a>
                                    
                                    </div>
                                </div>
                                <div className='col-xs-8'>
                                    
                                </div>
                                  <div className='col-xs-2'>
                                    <div className='slideshow-nav-button-right'>
                                        <a className='right pull-right' href='#slideshow-carousel' role='button' data-slide='next'>
                                            <span className='glyphicon glyphicon-chevron-right' aria-hidden='true'/>
                                            <span className='sr-only'>Next</span>
                                        </a>
                                   </div>   
                                </div>
                            </div>
                        </div>
                       
                   </div>
                   
        }else {
             return <div></div>
                    
        }
        
    }
    
  
};
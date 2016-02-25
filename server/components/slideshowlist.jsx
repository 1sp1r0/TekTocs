import React from 'react';

export  class SlideshowList extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {ok:false}};
  }

  
   componentDidMount() {
       
       let self=this;
       
       $.ajax({
      url: 'https://tektocs.herokuapp.com/api/' + self.props.userid , //this.props.url,
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
       
        if(this.state.data.ok){
             let slideshows='';
             if(this.state.data.result.length>0){
                 var self=this;
                  slideshows=this.state.data.result.map(function(data,index){
                     return (<SlideshowLead data={data} key={data.slideshow.short_id}></SlideshowLead>);
                 });
                 return <div>{slideshows}</div>;
             }
             else {
                 return <div></div>;
             }
    }else{
        return <div></div>;
    }
    
  
}

}





export  class SlideshowLead extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
    this.setState({data: {coverslide:null,slideshow:null}});
  }
  
   componentDidMount() {
       this.setState({data: this.props.data});
   }
   

   
   render() {
       
        if(this.state.data && this.state.data.coverslide && this.state.data.slideshow){
           
            
             let coverSlide=<div />;
             if(this.state.data.coverslide.isImage){
                  if(this.state.data.coverslide.src){
                      coverSlide=(<div className='jumbotron-photo'>
                                <img src={this.state.data.coverslide.src} />
                             </div>); 
                  }
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
                                                    <span className='userinfo-extra'>{this.state.data.createDateText + '-' +  this.state.data.slideshow.slideCount + ' slides'}</span>
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                                   <div>{coverSlide}</div>
                                  <div className='slideshow-lead-title'>{this.state.data.slideshow.title}</div>   
                          
                        </div>
                       
                   </div>
                   
        }else {
             return <div></div>;
                    
        }
        
    }
    
  
}


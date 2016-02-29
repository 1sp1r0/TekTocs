import React from 'react';
import Infinite from 'react-infinite'
import Waypoint from 'react-waypoint'
const pageSize=15;

export  class SlideshowList extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {
       data: {ok:false,result:[]},
       isInitialLoad:true,
       skip:-1*pageSize
  };
  }

//componentWillMount(){
//    this.setState({ok:true,result:[]});
//}
  
   componentDidMount() {
       this.getSlideShows();
   }
   
   renderWaypoint() {
    //if (this.state.isInitialLoad) {
      //  this.state.isInitialLoad=false;
      
      return (
         <Waypoint
            onEnter={this.getSlideShows.bind(this)}
          threshold={2.0}
        />
      );
    //}
  }
  
 
   
   getSlideShows(){
       
      /* if(this.state.noMoreRecords){
           return;
       }
       this.state.isInfiniteLoading= true;*/
       
       this.state.skip=this.state.skip+pageSize;
       let self=this;
       
       $.ajax({
      url: 'https://tektocs.herokuapp.com/api/users/' + self.props.userid + '/slideshows?skip=' + self.state.skip , //this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
          
          if(data.ok && data.result.length > 0){
              //self.state.noMoreRecords=true;
              data.result=self.state.data.result.concat(data.result);
              self.setState({data: data});
          }
          
          
        
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });
   }
   
    

    elementInfiniteLoad() {
        return <div>
                   Loading...
               </div>;
    }

   
   render() {
       
        if(this.state.data.ok){
             let slideshows=<div></div>;
            // if(this.state.data.result.length>0){
                 var self=this;
                  slideshows=this.state.data.result.map(function(data,index){
                     return (<SlideshowLead userid={self.props.userid} data={data} key={data.slideshow.short_id}></SlideshowLead>);
                 });
                 return <div>
                            {slideshows}
                            {this.renderWaypoint()}
                        </div>    
                 /*return <Infinite  elementHeight={200}
                         infiniteLoadBeginEdgeOffset={200}
                         onInfiniteLoad={this.getSlideShows.bind(this)}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading} 
                         useWindowAsScrollContainer={true}
                         >
                            {slideshows}
                         </Infinite>   */
            // }
            // else {
            //     return <div></div>;
            // }
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
       //this.setState();
   }
   

   
   render() {
       
        if(this.props.data && this.props.data.coverslide && this.props.data.slideshow){
           
            
             let coverSlide=<div />;
             if(this.props.data.coverslide.isImage){
                  if(this.props.data.coverslide.src){
                      coverSlide=(<a href={'/slideshows/' + this.props.userid + '/' + this.props.data.slideshow.short_id }>
                                      <div className='jumbotron-photo'>
                                            <img src={this.props.data.coverslide.src} />
                                      </div>      
                                </a>); 
                  }
              }
             
            return <div className='jumbotron'>
                        <div className='jumbotron-contents'>
                                    <div className='row'>
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            <div className='floatLeft'>
                                                <div className='avatar-container'>
                                                    <a className='avatar'>
                                                        <img className='avatar-image' src={this.props.data.slideshow.creator.image_32} />
                                                    </a>
                                                </div>    
                                                <div className='userinfo'>
                                                    <a href={'/slideshows/' + this.props.userid}>{this.props.data.name}</a>
                                                    <span className='userinfo-extra'>{this.props.data.createDateText + '-' +  this.props.data.slideshow.slideCount }</span>
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                                   <div>{coverSlide}</div>
                                  <a href={'/slideshows/' + this.props.userid + '/' + this.props.data.slideshow.short_id } className='slideshow-lead-title'>{this.props.data.slideshow.title}</a>   
                          
                        </div>
                       
                   </div>
                   
        }else {
             return <div></div>;
                    
        }
        
    }
    
  
}


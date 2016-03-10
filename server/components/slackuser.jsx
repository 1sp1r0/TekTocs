import React from 'react';

export default class SlackUser extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }
  componentWillMount() {
      this.setState({data:{ok:false, result:{name:'',image:'',description:''}}});
    
  }
  
   componentDidMount() {
       let self=this;
       
       $.ajax({
      url: `${process.env.TEKTOCS_API_BASE_URL}/users/${self.props.userid}` ,
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
            
            return <div className='jumbotron'>
                        <div className='jumbotron-contents bs-sidebar affix' id='sidebar'>
                            <div className='avatar-container'>
                                <a className='avatar'>
                                    <img className='avatar-image' src={this.state.data.result.image} />
                                </a>
                            </div>
                            <h3>{this.state.data.result.name}</h3>
                        </div>
                   </div>
           
        }else {
             return <div></div>
                    
        }
        
    }
    
  
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import $ from 'jquery';
//import * as slackhelper from '../helpers/slackhelper'
//import co from 'co'
//import winston from '../logger'

//import * as Models from '../models/'
//import "babel-polyfill"

var Slideshow = function (_React$Component) {
    _inherits(Slideshow, _React$Component);

    function Slideshow(props) {
        _classCallCheck(this, Slideshow);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Slideshow).call(this, props));

        _this.state = { data: {} };
        return _this;
    }

    _createClass(Slideshow, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            /*self.setState({data:{"_id":"56c48c712e72031300da30ad","attachments":{"slideshow":{"end_ts":"1455721625.000064","start_ts":"1455721584.000058","title":"test123qwqwqwq","short_id":"VJZqsdTcg","creator":{"_id":"4yCptPn5e","user_id":"U02HT4JUU","name":"murali","image_192":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F7fa9%2Fimg%2Favatars%2Fava_0000-192.png","image_72":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-72.png","image_48":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-48.png","image_32":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-32.png","image_24":"https://secure.gravatar.com/avatar/4e314473c8fd3c8950a0649238e1297f.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F66f9%2Fimg%2Favatars%2Fava_0000-24.png","email":"murali@agateconsulting.com","real_name":"Murali Narasimhan","last_name":"Narasimhan","first_name":"Murali"},"published":true,"slides":[{"_id":"56c48c9f8179df240033aeea","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test123","slideIndex":1},{"_id":"56c48c9f8179df240033aeeb","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test456","slideIndex":2},{"_id":"56c48c9f8179df240033aeec","slideMode":"hosted","slideMimeType":"image/jpeg","slideTitle":"bg1.jpg","slideAssetUrl":"https://files.slack.com/files-pri/T02HT4JUQ-F0MNY1Z52/download/bg1.jpg","slideCaption":"","slideText":"","slideIndex":3},{"_id":"56c48c9f8179df240033aeed","slideMode":"","slideMimeType":"","slideTitle":"","slideAssetUrl":"","slideCaption":"","slideText":"test789","slideIndex":4}]}}}});*/

            console.log('componentWillMount');

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
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;
            console.log('componentDidMount');
            $.ajax({
                url: 'https://tektocs.herokuapp.com/api/' + self.props.userid + '/' + self.props.slideshowid, //this.props.url,
                dataType: 'json',
                cache: false,
                success: function success(data) {
                    self.setState({ data: data });
                },
                error: function error(xhr, status, err) {
                    console.error(self.props.url, status, err.toString());
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.data.slideshow) {
                //let name=(this.state.data.attachments.slideshow.creator.real_name?
                //      this.state.data.attachments.slideshow.creator.real_name:
                //      (this.state.data.attachments.slideshow.creator.name?
                //      this.state.data.attachments.slideshow.creator.name:''));
                var coverSlide = _react2.default.createElement('div', null);

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
                if (this.state.data.coverslide.isImage) {
                    var imgSrc = 'data:' + this.state.data.mimeType + ';base64,' + this.state.data.coverslide.base64;
                    coverSlide = _react2.default.createElement(
                        'div',
                        { className: 'item active' },
                        _react2.default.createElement('img', { src: imgSrc })
                    );
                } else {
                    coverSlide = _react2.default.createElement(
                        'div',
                        { className: 'item active slideContainer' },
                        _react2.default.createElement(
                            'div',
                            { className: 'slide' },
                            this.state.data.coverslide.text
                        )
                    );
                }
                return _react2.default.createElement(
                    'div',
                    { className: 'jumbotron' },
                    _react2.default.createElement(
                        'div',
                        { className: 'jumbotron-contents' },
                        _react2.default.createElement(
                            'div',
                            { className: 'row' },
                            _react2.default.createElement(
                                'div',
                                { className: 'col-md-12' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'floatLeft' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'avatar-container' },
                                        _react2.default.createElement(
                                            'a',
                                            { className: 'avatar' },
                                            _react2.default.createElement('img', { className: 'avatar-image', src: this.state.data.slideshow.creator.image_32 })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'userinfo' },
                                        _react2.default.createElement(
                                            'a',
                                            null,
                                            this.state.data.name
                                        ),
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'userinfo-extra' },
                                            'created on ',
                                            12 / 23 / 2015
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'slideshow-title' },
                            this.state.data.slideshow.title
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'carousel', id: 'slideshow-carousel' },
                        _react2.default.createElement(
                            'div',
                            { className: 'carousel-inner', role: 'listbox' },
                            coverSlide
                        )
                    )
                );
            } else {
                return _react2.default.createElement('div', null);
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

    }]);

    return Slideshow;
}(_react2.default.Component);

exports.default = Slideshow;
;
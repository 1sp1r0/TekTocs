'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      console.log('componentDidMount');
      _jquery2.default.ajax({
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
      console.log('render:' + this.state.data);
      if (this.state.data.attachments) {
        return _react2.default.createElement(
          'div',
          { className: 'commentBox' },
          _react2.default.createElement(
            'h1',
            null,
            this.state.data.attachments.slideshow.title
          )
        );
      } else {
        return _react2.default.createElement(
          'div',
          { className: 'commentBox' },
          _react2.default.createElement('h1', null)
        );
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
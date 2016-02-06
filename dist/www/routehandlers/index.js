'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _home = require('./home');

Object.defineProperty(exports, 'home_index', {
  enumerable: true,
  get: function get() {
    return _home.index;
  }
});

var _slack = require('./slack');

var _loop = function _loop(_key2) {
  if (_key2 === "default") return 'continue';
  Object.defineProperty(exports, _key2, {
    enumerable: true,
    get: function get() {
      return _slack[_key2];
    }
  });
};

for (var _key2 in _slack) {
  var _ret = _loop(_key2);

  if (_ret === 'continue') continue;
}
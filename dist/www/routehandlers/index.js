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

var _loop = function _loop(_key5) {
  if (_key5 === "default") return 'continue';
  Object.defineProperty(exports, _key5, {
    enumerable: true,
    get: function get() {
      return _slack[_key5];
    }
  });
};

for (var _key5 in _slack) {
  var _ret = _loop(_key5);

  if (_ret === 'continue') continue;
}

var _slashcommands = require('./slashcommands');

var _loop2 = function _loop2(_key6) {
  if (_key6 === "default") return 'continue';
  Object.defineProperty(exports, _key6, {
    enumerable: true,
    get: function get() {
      return _slashcommands[_key6];
    }
  });
};

for (var _key6 in _slashcommands) {
  var _ret2 = _loop2(_key6);

  if (_ret2 === 'continue') continue;
}

var _slideshows = require('./slideshows');

var _loop3 = function _loop3(_key7) {
  if (_key7 === "default") return 'continue';
  Object.defineProperty(exports, _key7, {
    enumerable: true,
    get: function get() {
      return _slideshows[_key7];
    }
  });
};

for (var _key7 in _slideshows) {
  var _ret3 = _loop3(_key7);

  if (_ret3 === 'continue') continue;
}

var _api = require('./api');

var _loop4 = function _loop4(_key8) {
  if (_key8 === "default") return 'continue';
  Object.defineProperty(exports, _key8, {
    enumerable: true,
    get: function get() {
      return _api[_key8];
    }
  });
};

for (var _key8 in _api) {
  var _ret4 = _loop4(_key8);

  if (_ret4 === 'continue') continue;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slackteam = require('./slackteam');

var _loop = function _loop(_key4) {
  if (_key4 === "default") return 'continue';
  Object.defineProperty(exports, _key4, {
    enumerable: true,
    get: function get() {
      return _slackteam[_key4];
    }
  });
};

for (var _key4 in _slackteam) {
  var _ret = _loop(_key4);

  if (_ret === 'continue') continue;
}

var _slashcommand = require('./slashcommand');

var _loop2 = function _loop2(_key5) {
  if (_key5 === "default") return 'continue';
  Object.defineProperty(exports, _key5, {
    enumerable: true,
    get: function get() {
      return _slashcommand[_key5];
    }
  });
};

for (var _key5 in _slashcommand) {
  var _ret2 = _loop2(_key5);

  if (_ret2 === 'continue') continue;
}

var _slackuser = require('./slackuser');

var _loop3 = function _loop3(_key6) {
  if (_key6 === "default") return 'continue';
  Object.defineProperty(exports, _key6, {
    enumerable: true,
    get: function get() {
      return _slackuser[_key6];
    }
  });
};

for (var _key6 in _slackuser) {
  var _ret3 = _loop3(_key6);

  if (_ret3 === 'continue') continue;
}
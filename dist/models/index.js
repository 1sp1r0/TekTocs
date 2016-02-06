'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slackteam = require('./slackteam');

var _loop = function _loop(_key3) {
  if (_key3 === "default") return 'continue';
  Object.defineProperty(exports, _key3, {
    enumerable: true,
    get: function get() {
      return _slackteam[_key3];
    }
  });
};

for (var _key3 in _slackteam) {
  var _ret = _loop(_key3);

  if (_ret === 'continue') continue;
}

var _slashcommand = require('./slashcommand');

var _loop2 = function _loop2(_key4) {
  if (_key4 === "default") return 'continue';
  Object.defineProperty(exports, _key4, {
    enumerable: true,
    get: function get() {
      return _slashcommand[_key4];
    }
  });
};

for (var _key4 in _slashcommand) {
  var _ret2 = _loop2(_key4);

  if (_ret2 === 'continue') continue;
}
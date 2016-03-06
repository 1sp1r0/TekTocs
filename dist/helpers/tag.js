'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = tag;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tag(strings) {
    if (strings && strings.length > 0) {
        var configValue = _config2.default[strings[0]];
        if (typeof configValue === 'function') {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            return _config2.default[strings[0]].apply(_config2.default, values);
        } else {
            return _config2.default[strings[0]];
        }
    }
}
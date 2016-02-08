'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbConnection = function () {
    function DbConnection() {
        _classCallCheck(this, DbConnection);
    }

    _createClass(DbConnection, null, [{
        key: 'connect',
        value: function connect() {

            _mongoose2.default.connect(process.env.MONGOLAB_URI);

            _mongoose2.default.connection.on('connected', function () {});

            _mongoose2.default.connection.on('error', function (err) {
                _logger2.default.log('error', 'Mongoose connection error: ' + err);
            });

            _mongoose2.default.connection.on('disconnected', function () {});

            process.on('SIGINT', function () {
                _mongoose2.default.connection.close(function () {
                    process.exit(0);
                });
            });
        }
    }]);

    return DbConnection;
}();

exports.default = DbConnection;
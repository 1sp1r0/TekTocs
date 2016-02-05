"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorRunner = function () {
    function GeneratorRunner() {
        _classCallCheck(this, GeneratorRunner);
    }

    _createClass(GeneratorRunner, [{
        key: "runCallbackGenerator",
        value: function runCallbackGenerator(gen) {
            var iterator = gen();

            function callback() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var nextResult = iterator.next(args);
                if (nextResult.done) return;
                nextResult.value(callback);
            }
            callback();
        }
    }, {
        key: "runPromiseGenerator",
        value: function runPromiseGenerator(gen) {
            var iterator = gen();

            function successHandler(result) {
                var nextResult = iterator.next(result);
                if (nextResult.done) {
                    return;
                }
                nextResult.value.then(successHandler);
            }

            successHandler();
        }
    }]);

    return GeneratorRunner;
}();

exports.default = GeneratorRunner;
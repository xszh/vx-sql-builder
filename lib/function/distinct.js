'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../expr'),
    Expr = _require.Expr;

var Distinct = function (_Expr) {
  _inherits(Distinct, _Expr);

  function Distinct(field) {
    _classCallCheck(this, Distinct);

    var _this = _possibleConstructorReturn(this, (Distinct.__proto__ || Object.getPrototypeOf(Distinct)).call(this, 'distinct'));

    _this.field = field;
    return _this;
  }

  _createClass(Distinct, [{
    key: 'toSQL',
    value: function toSQL() {
      var tmp = this.field;
      if (!(tmp instanceof Expr)) {
        tmp = new Expr(tmp);
      }
      return 'DISTINCT ' + tmp.toSQL(true);
    }
  }]);

  return Distinct;
}(Expr);

module.exports = Distinct;
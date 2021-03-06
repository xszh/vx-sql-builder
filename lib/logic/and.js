'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogicOp = require('./logicOp');

var And = function (_LogicOp) {
  _inherits(And, _LogicOp);

  function And() {
    var _ref;

    _classCallCheck(this, And);

    for (var _len = arguments.length, conditions = Array(_len), _key = 0; _key < _len; _key++) {
      conditions[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_ref = And.__proto__ || Object.getPrototypeOf(And)).call.apply(_ref, [this, 'AND'].concat(conditions)));
  }

  return And;
}(LogicOp);

module.exports = And;
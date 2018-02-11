'use strict';

var _require = require('../expr'),
    Expr = _require.Expr;

var _ = require('lodash');

module.exports = function Literal(expr) {
  if (expr instanceof Expr) {
    return expr.toSQL();
  }
  if (_.isString(expr)) {
    return '\'' + expr + '\'';
  }
  return expr;
};
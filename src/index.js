const Tables = require('./table');
const Querys = require('./query');
const Funcs = require('./function');
const Conditions = require('./condition');
const Exprs = require('./expr');
const Logics = require('./logic');

module.exports = Object.assign({}, Tables, Querys, Funcs, Conditions, Exprs, Logics);

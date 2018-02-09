const Field = require('./field');

class StarField extends Field {
  constructor(table) {
    super('*', table);
  }
}

module.exports = StarField;

const ICrud = require('./interfaces/iCrud');

class Postgres extends ICrud {
  constructor() {
    super();
  }

  create() {
    console.log('Item saved in Postgres');
  }
}

module.exports = Postgres;
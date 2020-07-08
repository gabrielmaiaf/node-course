const ICrud = require('./interfaces/iCrud');

class MongoDB extends ICrud {
  constructor() {
    super();
  }

  create() {
    console.log('Item saved in MongoDB')
  }
}

module.exports = MongoDB;
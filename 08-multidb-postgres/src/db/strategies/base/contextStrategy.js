const ICrud = require('../interfaces/iCrud');

class ContextStrategy extends ICrud {
  constructor(database) {
    super();
    this._database = database;
  }

  create(item) {
    return this._database.create(item);
  }

  read(item) {
    return this._database.read(item);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(id) {
    return this._database.delete(id);
  }

  isConnected() {
    return this._database.isConnected();
  }

  connect() {
    return this._database.connect();
  }
}

module.exports = ContextStrategy;

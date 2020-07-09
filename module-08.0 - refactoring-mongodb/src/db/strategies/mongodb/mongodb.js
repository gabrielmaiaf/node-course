const ICrud = require('../interfaces/iCrud');
const Mongoose = require('mongoose');

const statusDict = {
  0: 'Disconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Disconectando'
}

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = statusDict[this._connection.readyState];
    if (state === 'Conectado') return true;
    if (state === 'Conectando') {
      await new Promise(resolve => setTimeout(resolve, 1000));      
    }

    return statusDict[this._connection.readyState]
  }

  static connect() {
    Mongoose.connect('mongodb://bielmaia:senhasecreta@localhost:27017/herois', {
      useNewUrlParser: true
    }, function (error) {
      if (!error) return;
      console.error('Falha na conexão!', error)
    })

    const connection = Mongoose.connection;
    connection.once('open', () => console.log('Database rodando!'));
    return connection;
  }

  create(item) {
    return this._schema.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item })
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
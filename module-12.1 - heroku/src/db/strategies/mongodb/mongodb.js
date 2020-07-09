const ICrud = require('../interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const statusDict = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting'
}

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = statusDict[this._connection.readyState];
    if (state === 'Connected') return true;
    if (state === 'Connecting') {
      await new Promise(resolve => setTimeout(resolve, 1000));      
    }

    return statusDict[this._connection.readyState]
  }

  static connect() {
    Mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true
    }, function (error) {
      if (!error) return;
      console.error('Connection fail!', error)
    })

    const connection = Mongoose.connection;
    connection.once('open', () => console.log('Database running!'));
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
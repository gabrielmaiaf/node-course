const ICrud = require('./interfaces/iCrud');
const Mongoose = require('mongoose');

const statusDict = {
  0: 'Disconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Disconectando'
}

class MongoDB extends ICrud {
  constructor() {
    super();
    this._herois = null;
    this._driver = null;
  }

  async isConnected() {
    const state = statusDict[this._driver.readyState];
    if (state === 'Conectado') return true;
    if (state === 'Conectando') {
      await new Promise(resolve => setTimeout(resolve, 1000));      
    }

    return statusDict[this._driver.readyState]
  }

  connect() {
    Mongoose.connect('mongodb://bielmaia:senhasecreta@localhost:27017/herois', {
      useNewUrlParser: true
    }, function (error) {
      if (!error) return;
      console.error('Falha na conexão!', error)
    })

    this._driver = Mongoose.connection;
    this._driver.once('open', () => console.log('Database rodando!'));
    this.defineModel();
  }

  defineModel() {
    const heroiSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true
      },
      poder: {
        type: String,
        required: true
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    })
    this._herois = Mongoose.model('herois', heroiSchema);
  }

  create(item) {
    return this._herois.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._herois.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._herois.updateOne({ _id: id }, { $set: item })
  }

  delete(id) {
    return this._herois.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
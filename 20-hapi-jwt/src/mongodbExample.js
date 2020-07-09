const Mongoose = require('mongoose');

Mongoose.connect('mongodb://bielmaia:senhasecreta@localhost:27017/herois', {
  useNewUrlParser: true
}, function (error) {
  if (!error) return;
  console.error('Falha na conexão!', error)
})

const connection = Mongoose.connection;
connection.once('open', () => console.log('Database rodando!'));

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

const model = Mongoose.model('herois', heroiSchema);

async function main() {
  // const resultCadastrar = await model.create({
  //   nome: 'Batman',
  //   poder: 'Money'
  // });
  // console.log('Resultado', resultCadastrar);

  const listItems = await model.find();
  console.log('Items', listItems);
}

main();
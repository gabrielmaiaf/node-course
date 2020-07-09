// yarn add sequelize pg-hstore pg
const Sequelize = require('sequelize');
const driver = new Sequelize(
  'heroes',
  'bielmaia',
  'senhasecreta',
  {
    host: 'localhost',
    dialect: 'postgres',
    quoteIdentifiers: false,
    operatorAliases: false
  }
)

async function main() {
  const Herois = driver.define('heroes', {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING,
      required: true
    },
    poder: {
      type: Sequelize.STRING,
      required: true
    }
  }, {
    tableName: 'TB_HEROIS',
    freezeTableName: false,
    timestamps: false
  })

  await Herois.sync();
  await Herois.create({
    nome: 'Green lantern',
    poder: 'Willpower ring'
  })
  const result = await Herois.findAll({ raw: true });
  console.log('result', result);
}

main();
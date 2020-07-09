const Commander = require('commander');
const Database = require('./database');
const Hero = require('./hero');

async function main() {
  Commander
    .version('v1')
    .option('-n, --name [value]', 'Hero name')
    .option('-p, --power [value]', 'Hero power')
    .option('-i, --id [value]', 'Hero id')

    .option('-c, --create', 'Create a hero')
    .option('-r, --read', "Read heroes")
    .option('-u, --update [value]', "Update a hero by id")
    .option('-d, --delete [value]', "Delete a hero by id")
    .parse(process.argv)

  const heroi = new Hero(Commander);

  try {
    if (Commander.create) {
      delete heroi.id;
      console.log(heroi);

      const resultado = await Database.create(heroi);
      if (!resultado) {
        console.error('Herói doesn`t created');
        return;
      }

      console.log('Successful created new hero!');
    }

    if (Commander.read) {
      const resultado = await Database.read();
      console.log(resultado);
      return;      
    }

    if (Commander.delete) {
      const targetId = parseInt(Commander.delete);
      const resultado = await Database.remove(targetId);
      if (!resultado)
        console.error('Hero doesn`t removed')

      console.log('Successful removed hero');
      return;
    }

    if (Commander.update) {
      const targetId = parseInt(Commander.update);
      const dado = JSON.stringify(heroi);
      const heroiRef = JSON.parse(dado);
      const resultado = await Database.update(targetId, heroiRef);
      if (!resultado) {
        console.error('Hero doesn`t updated');
        return;
      }

      console.log('Successful updated hero!');
    }
    
  } catch (error) {
    console.error('Crashed!', error)
  }
}

main();
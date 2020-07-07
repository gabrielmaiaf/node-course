const service = require('./service');

Array.prototype.meuMap = function (callback) {
  const novoArrayMap = [];
  for(let i = 0; i <= this.length - 1; i++) {
    const resultado = callback(this[i], i);
    novoArrayMap.push(resultado);
  }

  return novoArrayMap;
}

async function main() {
  try {
    const results = await service.getPeople('a');
    // const names = [];
    // results.results.forEach(function(item) {
    //   names.push(item.name);
    // })
    // const names = results.results.map(function(pessoa) {
    //   return pessoa.name;
    // })
    const names = results.results.meuMap((pessoa) => pessoa.name);
    console.log(names);
  } catch(err) {
    console.error('internal error', err);
  }
}

main();
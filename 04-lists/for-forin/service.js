const axios = require('axios');
const URL = 'https://swapi.dev/api/people';

async function getPeople(nome) {
  const url = `${URL}/?search=${nome}&format=json`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = {
  getPeople
}

// getPeople('r2')
// .then(function (resultado) {
//   console.log('resultado', resultado);
// }). catch(function (err) {
//   console.error('deu merda', err);
// })
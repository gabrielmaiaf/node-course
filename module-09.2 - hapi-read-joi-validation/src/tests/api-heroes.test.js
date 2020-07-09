const assert = require('assert');
const api = require('../api');
let app = {};

describe.only('Heroes API test', function () {
  this.beforeAll(async () => {
    app = await api;
  })
  it('Listar heróis pela /herois', async() => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois'
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  })
  it('Listar somente 3 heróis', async () => {
    const SIZE_LIMIT = 3;
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${SIZE_LIMIT}`
    })
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === SIZE_LIMIT);
  })
  it('Deve retornar um erro com "limit" errado', async () => {
    const SIZE_LIMIT = 'to-the-moon';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${SIZE_LIMIT}`
    });

    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 400);
  })
  it('Listar somente 1 herói', async () => {
    const NAME = 'Superman';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&nome=${NAME}`
    })
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome === NAME);
  })
})
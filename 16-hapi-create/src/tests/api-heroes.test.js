const assert = require('assert');
const api = require('../api');
let app = {};

const MOCK_HERO_CREATE = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica'
}

describe.only('Heroes API test', function () {
  this.beforeAll(async () => {
    app = await api;
  })
  it('Read heroes by /herois', async() => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois'
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  })
  it('Read only 3 heroes', async () => {
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
  it('Should return a error with wrong "limit"', async () => {
    const SIZE_LIMIT = 'to-the-moon';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${SIZE_LIMIT}`
    });

    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 400);
  })
  it('Should read only 1 hero', async () => {
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
  it('Should create hero', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: MOCK_HERO_CREATE
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);
    assert.ok(statusCode === 201);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, 'Successfully created new hero!')
  });
})
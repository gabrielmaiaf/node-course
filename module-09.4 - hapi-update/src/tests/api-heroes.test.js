const assert = require('assert');
const api = require('../api');
let app = {};

const MOCK_HERO_CREATE = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica'
}

const MOCK_HERO_UPDATE = {
  nome: 'Hawkeye',
  poder: 'Mira'
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
  it('Should update hero using PATCH method', async () => {
    const addToUpdate = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_HERO_UPDATE)
    });
    const updateData = JSON.parse(addToUpdate.payload);

    const expected = {
      poder: 'Super mira'
    }
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${updateData._id}`,
      payload: JSON.stringify(expected)
    });

    const data = JSON.parse(result.payload);
    assert.ok(result.statusCode === 200);
    assert.deepEqual(data.message, 'Successfully updated hero');
  });
  it('Should fail update hero using PATCH method using incorrect id', async () => {
    const expected = {
      poder: 'Super mira'
    }

    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/ca421358131e`,
      payload: JSON.stringify(expected)
    });

    const data = JSON.parse(result.payload);
    assert.ok(result.statusCode === 400);
    assert.deepEqual(data.message, 'Not allowed update. No donuts for you');
  });
})
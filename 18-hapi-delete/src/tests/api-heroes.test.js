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

let MOCK_ID = '';

describe.only('Heroes API test', function () {
  this.beforeAll(async () => {
    app = await api;
    const addToUpdate = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_HERO_UPDATE)
    });
    const updateData = JSON.parse(addToUpdate.payload);
    MOCK_ID = updateData._id;
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
    const expected = {
      poder: 'Super mira'
    }
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${MOCK_ID}`,
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
    assert.ok(result.statusCode === 412);
    assert.deepEqual(data.message, 'Not allowed update. No donuts for you');
  });
  it('Should delete hero using DELETE method by id', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${MOCK_ID}`
    })
    const { statusCode } = result;
    const data = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, 'Successfully deleted hero');
  });
  it('Should fail delete hero using incorrect id', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/ca421358131e`
    });

    const data = JSON.parse(result.payload);
    assert.ok(result.statusCode === 412);
    assert.deepEqual(data.message, 'Not allowed remove hero. Too strong to delete');
  });
  it('Should fail delete hero using incorrect id', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/ID_INVALIDO`
    });

    const data = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    };

    assert.ok(result.statusCode === 500);
    assert.deepEqual(data, expected);
  });
})
const assert = require('assert');
const api = require('../api');

let app = {};

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;
  })
  it('Should get a token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'Heroassociation',
        password: '123'
      }
    })

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(data.token.length > 10);
  })
})
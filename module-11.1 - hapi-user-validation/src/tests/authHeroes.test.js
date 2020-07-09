const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UserSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {};

const MOCK_USER = {
  username: 'Heroassociation',
  password: '123'
}

const MOCK_USER_DB = {
  username: MOCK_USER.username.toLowerCase(),
  password: '$2b$04$qO31l5LKOAV0xPwbdtgAkeD6rgUcNqIRcfiUMYfUE1/EBfQLL2I5a'
}

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UserSchema);
    const postgres = await new Context(new Postgres(connectionPostgres, model))
    await postgres.update(null, MOCK_USER_DB, true);
  })
  it('Should get a token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: MOCK_USER
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(data.token.length > 10);
  });
  it('Should return "not authorized" when pass a wrong login', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'genos',
        password: '1234'
      }
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.deepEqual(data.error, 'Unauthorized');
  })
})
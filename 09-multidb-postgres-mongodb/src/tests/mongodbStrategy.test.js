const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb');
const ContextStr = require('../db/strategies/base/contextStrategy');

const context = new ContextStr(new MongoDB());

const MOCK_HEROI_CADASTRAR = {
  nome: 'Mulher Maravilha',
  poder: 'Amazon'
}

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Yellow Lantern',
  poder: 'Fear ring'
}

describe('MongoDB Strategy', function () {
  this.beforeAll(async () => {
    await context.connect()
  });
  it('MongoDB connection', async () => {
    const result = await context.isConnected();
    const expected = 'Conectado';

    assert.deepEqual(result, expected);
  });
  it('Should create new hero', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });
  it('Should read hero', async () => {
    const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    const result = { nome, poder };
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });
  it('Should update hero', async () => {
    const itemToUpdate = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.update(itemToUpdate._id, {
      nome: 'Red Lantern',
      poder: 'Rage Ring'
    });
    assert.deepEqual(result.nModified, 1);
  });
  it('Should remove hero by id', async () => {
    const itemToUpdate = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.delete(itemToUpdate._id);
    assert.deepEqual(result.n, 1);
  })
})
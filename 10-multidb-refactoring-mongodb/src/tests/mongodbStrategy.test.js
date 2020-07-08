const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const ContextStr = require('../db/strategies/base/contextStrategy');

let context = {};

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
    const connection = MongoDB.connect();
    context = new ContextStr(new MongoDB(connection, HeroiSchema));
  });
  it('Verificar conexão', async () => {
    const result = await context.isConnected();
    const expected = 'Conectado';

    assert.deepEqual(result, expected);
  });
  it('Cadastrar novo herói', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });
  it('Read hero', async () => {
    const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    const result = { nome, poder };
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });
  it('Update hero', async () => {
    const itemToUpdate = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.update(itemToUpdate._id, {
      nome: 'Red Lantern',
      poder: 'Rage Ring'
    });
    assert.deepEqual(result.nModified, 1);
  });
  it('Delete hero', async () => {
    const itemToUpdate = await context.create(MOCK_HEROI_ATUALIZAR);
    const result = await context.delete(itemToUpdate._id);
    assert.deepEqual(result.n, 1);
  })
})
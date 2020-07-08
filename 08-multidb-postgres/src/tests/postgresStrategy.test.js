const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const ContextStr = require('../db/strategies/base/contextStrategy');

const context = new ContextStr(new Postgres());
const MOCK_HERO_CREATE = {
  nome: 'Gavião Negro',
  poder: 'Reborn'
};

const MOCK_HERO_UPDATE = {
  nome: 'Batman',
  poder: 'Money'
}

describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
    await context.connect();
  })
  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  })
  it('Should create new hero', async function () {
    const result = await context.create(MOCK_HERO_CREATE);

    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  })
  it('Should read hero', async function () {
    const [result] = await context.read({ nome: MOCK_HERO_CREATE.nome });
    
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
  it('Should update hero', async function () {
    const createItemRefresh = await context.create(MOCK_HERO_UPDATE);
    const [itemRefresh] = await context.read({ nome: createItemRefresh.nome });
    const newItem = {
      ...MOCK_HERO_UPDATE,
      nome: 'Iron Man'
    }
    const [result] = await context.update(itemRefresh.id, newItem);
    const [itemAtualizado] = await context.read({ id: itemRefresh.id });
    assert.deepEqual(itemAtualizado.nome, newItem.nome);
    assert.deepEqual(result, 1);
  });
  it('Should remove hero by id', async function () {
    const [item] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  })
})
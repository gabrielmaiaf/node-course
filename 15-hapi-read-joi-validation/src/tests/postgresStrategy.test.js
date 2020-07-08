const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroiSchema = require('../db/strategies/postgres/schemas/heroiSchema')
const ContextStr = require('../db/strategies/base/contextStrategy');

let context = {};
// const context = new ContextStr(new Postgres());
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
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new ContextStr(new Postgres(connection, model));
  })
  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  })
  it('Create new hero', async function () {
    const result = await context.create(MOCK_HERO_CREATE);

    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  })
  it('Read hero', async function () {
    const [result] = await context.read({ nome: MOCK_HERO_CREATE.nome });
    
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
  it('Update hero by name', async function () {
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
  it('Remove hero by id', async function () {
    const [item] = await context.read({ nome: MOCK_HERO_CREATE.nome });
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  })
})
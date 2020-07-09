const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const ContextStr = require('../db/strategies/base/contextStrategy');

const context = new ContextStr(new Postgres());
const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Reborn'
};

const MOCK_HEROI_ATUALIZAR = {
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
  it('Cadastrar novo herói', async function () {
    const result = await context.create(MOCK_HEROI_CADASTRAR);

    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  })
  it('Listar herói', async function () {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });
  it('Atualizar herói', async function () {
    const createItemRefresh = await context.create(MOCK_HEROI_ATUALIZAR);
    const [itemRefresh] = await context.read({ nome: createItemRefresh.nome });
    const newItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Iron Man'
    }
    const [result] = await context.update(itemRefresh.id, newItem);
    const [itemAtualizado] = await context.read({ id: itemRefresh.id });
    assert.deepEqual(itemAtualizado.nome, newItem.nome);
    assert.deepEqual(result, 1);
  });
  it('Remover herói por id', async function () {
    const [item] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  })
})
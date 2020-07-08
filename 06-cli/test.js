const { deepEqual } = require('assert');

const database = require('./database');

const DEFAULT_ITEM_CREATE = {
  name: 'Flash',
  power: 'Speedforce',
  id: 1
};

const DEFAULT_ITEM_UPDATE = {
  name: 'Green Lantern',
  power: 'Power ring',
  id: 2
};

describe('Hero manipulation suite', () => {
  before(async() => {
    await database.create(DEFAULT_ITEM_CREATE);
    await database.create(DEFAULT_ITEM_UPDATE);
  })
  it('should search a hero using archive', async() => {
    const expected = DEFAULT_ITEM_CREATE;

    const [result] = await database.read(expected.id);

    deepEqual(result, expected);
  })
  it('should create a hero using archive', async () => {
    const expected = DEFAULT_ITEM_CREATE;

    const result = await database.create(DEFAULT_ITEM_CREATE);
    const [actual] = await database.read(DEFAULT_ITEM_CREATE.id);

    deepEqual(actual, expected);
  })
  it('should remove a hero by id', async () => {
    const expected = true;
    const resultado = await database.remove(DEFAULT_ITEM_CREATE.id);
    deepEqual(resultado, expected);
  })
  it('should update a hero by id', async () => {
    const expected = {
      ...DEFAULT_ITEM_UPDATE,
      name: 'Iron Man',
      power: 'Money'
    }
    const newData = {
      name: 'Iron Man',
      power: 'Money'
    }
    await database.update(DEFAULT_ITEM_UPDATE.id, newData);
    const [resultado] = await database.read(DEFAULT_ITEM_UPDATE.id);
    deepEqual(resultado, expected);
  })
})
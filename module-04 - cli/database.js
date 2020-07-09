const { readFile, writeFile } = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
  constructor() {
    this.ARCHIVE_NAME = 'herois.json'
  }

  async getArchiveData() {
    const archive = await readFileAsync(this.ARCHIVE_NAME, 'utf8');
    return JSON.parse(archive.toString());
  }

  async writeArchive(data) {
    await writeFileAsync(this.ARCHIVE_NAME, JSON.stringify(data));
    return true;
  }

  async create(hero) {
    const data = await this.getArchiveData();
    const id = hero.id < 2 ? hero.id : Date.now();

    const heroWithId = {
      id, ...hero
    }
  
    const finalData = [
      ...data, heroWithId
    ]
    const result = await this.writeArchive(finalData);

    return result; 
  }

  async read(id) {
    const data = await this.getArchiveData();
    const filteredData = data.filter(item => (id ? (item.id === id) : true));
    return filteredData;
  }

  async update(id, newData) {
    const data = await this.getArchiveData();
    const ind = data.findIndex(item => item.id === parseInt(id));
    if (ind === -1)
      throw new Error('Hero doesn`t exist');

    const atual = data[ind];
    const newObject = {
      ...atual,
      ...newData
    }
    data.splice(ind, 1);

    return await this.writeArchive([
      ...data, newObject
    ])
  }

  async remove(id) {
    if (!id)
      return await this.writeArchive([]);

    const dados = await this.getArchiveData();
    const ind = dados.findIndex(item => item.id === parseInt(id));
    if (ind === -1)
      throw new Error('Hero doesn`t exists.');

    dados.splice(ind, 1);
    return await this.writeArchive(dados);
  }
}

module.exports = new Database()
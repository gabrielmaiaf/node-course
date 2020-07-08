const BaseRoute = require('./base/baseRoutes');
const Boom = require('boom');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      handler: (request, h) => {
        try {
          const { skip, limit, nome } = request.query;
          let query = {};
          if (nome)
            query.nome = nome;

          if (skip && isNaN(skip))
            return Boom.badRequest('O tipo do skip é incorreto');

          if (limit && isNaN(limit))
            return Boom.badRequest('O tipo do limit é incorreto');

          return this.db.read(query, parseInt(skip), parseInt(limit));
        } catch (error) {
          console.error('Deu ruim', error);
          return 'Erro interno no servidor';
        }
      }
    }
  }
}

module.exports = HeroRoutes;
const BaseRoute = require('./base/baseRoutes');
const Boom = require('boom');
const Joi = require('joi');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        validate: {
          failAction: (request, headers, error) => {
            throw error;
          },
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          }
        }
      },
      handler: (request, h) => {
        try {
          const {
            skip,
            limit,
            nome
          } = request.query;
          const query = nome ? {
            nome: {
              $regex: `.*${nome}*.`
            }
          } : {};

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
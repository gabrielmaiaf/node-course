const BaseRoute = require('./base/baseRoutes');
const Boom = require('boom');
const Joi = require('joi');

const failAction = (request, headers, error) => {
  throw error;
};

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
          failAction,
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
          console.error('Crashed', error);
          return 'Server internal error';
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        validate: {
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(30)
          }
        }
      },
      handler: async (request, h) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });
          return h.response({
            message: 'Successfully created new hero!',
            _id: result._id
          }).code(201);          
        } catch (error) {
          console.error('Crashed!', error);
          return 'Server internal error';
        }
      }
    }
  }
}

module.exports = HeroRoutes;
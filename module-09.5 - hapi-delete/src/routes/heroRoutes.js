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
          return Boom.internal();
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
          return Boom.internal();
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        validate: {
          params: {
            id: Joi.string().required()
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(30)
          }
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;

          const dataString = JSON.stringify(payload);
          const data = JSON.parse(dataString);

          const result = await this.db.update(id, data);

          if (result.nModified !== 1)
            return Boom.preconditionFailed('Not allowed update. No donuts for you');

          return {
            message: 'Successfully updated hero'
          }

        } catch (error) {
          console.error('Crashed', error);
          return Boom.internal();
        }
      }
    }
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        validate: {
          failAction,
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);

          if (result.n !== 1)
            return Boom.preconditionFailed('Not allowed remove hero. Too strong to delete');

          return {
            message: 'Successfully deleted hero'
          }
        } catch (error) {
          console.error('Crashed', error);
          return Boom.internal();
        }
      }
    }
  }
}

module.exports = HeroRoutes;
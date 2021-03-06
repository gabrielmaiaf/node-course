const BaseRoute = require('./base/baseRoutes');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');

const failAction = (request, headers, error) => {
  throw error;
}

class AuthRoutes extends BaseRoute {
  constructor(secret) {
    super();
    this.secret = secret;
  }
  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'faz login com user e senha do banco',
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }
        }
      },
      handler: (request) => {
        const { username, password } = request.payload;

        if (username.toLowerCase() !== 'heroassociation' || password !== '123')
          return Boom.unauthorized();

        const token = Jwt.sign({
          username,
          id: 1
        }, this.secret)

        return {
          token
        }
      }
    }
  }
}

module.exports = AuthRoutes;

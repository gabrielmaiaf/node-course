const BaseRoute = require('./base/baseRoutes');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, headers, error) => {
  throw error;
}

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
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
      handler: async (request) => {
        const { username, password } = request.payload;

        const [user] = await this.db.read({
          username: username.toLowerCase(), 
        })

        if (!user)
          return Boom.unauthorized('Invalid user or password!');

        const match = await PasswordHelper.comparePassword(password, user.password);

        if (!match)
          return Boom.unauthorized('Invalid user or password!');

        // if (username.toLowerCase() !== 'heroassociation' || password !== '123')
        //   return Boom.unauthorized();

        const token = Jwt.sign({
          username,
          id: user.id
        }, this.secret)

        return {
          token
        }
      }
    }
  }
}

module.exports = AuthRoutes;

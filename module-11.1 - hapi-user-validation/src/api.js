const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb');
const Postgres = require('./db/strategies/postgres/postgres');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');

const JWT_SECRET = 'MEU_SEGREDO_JWT';

const app = new Hapi.Server({
  port: 5000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connectionMDB = MongoDB.connect();
  const contextMDB = new Context(new MongoDB(connectionMDB, HeroiSchema));
  const connectionPG = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPG, UserSchema);
  const contextPG = new Context(new Postgres(connectionPG, model));

  const swaggerOptions = {
    info: {
      title: 'Hero API - #CursoNodeBR',
      version: 'v1.0'
    },
    lang: 'pt'
  }

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions 
    }
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    validate: async (data, request) => {
      const [result] = await contextPG.read({
        username: data.username.toLowerCase()
      })
      
      if (!result) {
        return {
          isValid: false
        }
      }

      return {
        isValid: true
      }
    }
  })
  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new HeroRoutes(contextMDB), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPG), AuthRoutes.methods())
  ]);

  await app.start();
  console.log(`Servidor running at port ${app.info.port}`);

  return app;
}

module.exports = main();
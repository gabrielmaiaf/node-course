const BaseRoute = require('./base/baseRoutes');
const { join } = require('path');

class UtilRoutes extends BaseRoute {
  coverage() {
    return {
      path: '/coverage/{param*}',
      method: 'GET',
      config: {
        auth: false
      },
      handler: {
        directory: {
          path: join(__dirname, '../../coverage'),
          redirectToSlash: true,
          index: true
        }
      }
    }
  }
}

module.exports = UtilRoutes;
const BaseRoutes = require('./base/baseRoutes');
const BaseRoute = require('./base/baseRoutes');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      handler: () => this.db.read()
    }
  }
}

module.exports = HeroRoutes;
const Sequelize = require('sequelize');
const config = require('../config/config.js');

let sequelize;

if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      host: config.development.host,
      dialect: config.development.dialect,
    }
  );

} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(config.production.uri, {
    dialect: config.production.dialect,
    dialectModule: require('pg'),
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  });
}

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require('./user')(sequelize, Sequelize);
db.Token = require('./token')(sequelize, Sequelize);

// Define associations
Object.values(db)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(db));

module.exports = db;

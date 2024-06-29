const Sequelize = require('sequelize');
const config = require('../config/config.js');
// const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
// // const sequelize = new Sequelize( {
//   host: config.development.host,
//   dialect: config.development.dialect,
//   // storage: '../database/express_laundry.sqlite',
// });

const sequelize = new Sequelize(config.development.url);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require('./user')(sequelize, Sequelize);
db.Token = require('./token')(sequelize, Sequelize);

// Define associations
Object.values(db)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db));

module.exports = db;

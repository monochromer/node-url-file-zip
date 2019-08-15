const path = require('path');

const defaultPort = 3000;

module.exports = Object.freeze({
  port: process.env.PORT || defaultPort,
  public: path.resolve(process.cwd(), 'public')
});
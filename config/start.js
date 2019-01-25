// require('babel-register')({
// 	presets: ['env']
// });

// module.exports = require('./index.js')

// require('babel-register');
require('babel-core/register');
require('babel-polyfill');
require('./index');
require('../routes/main.routes');
require('../database');
// require('../tests/meetups');

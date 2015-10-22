var Backbone = require('backbone');

var Backbone1 = require('./backbone.sync')(Backbone);

var Backbone2 = require('./backbone.modal')(Backbone1);

exports = module.exports = Backbone;
var Backbone = require('backbone');


exports = module.exports = function(){
	new(require('./Router'))();
	Backbone.history.start();
};

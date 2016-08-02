//** entry
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
window.$ = $;

var router = require('./router');

//** router load success
router(function(){
	Backbone.history.start();
});

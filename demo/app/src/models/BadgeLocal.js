var Backbone = require('backbone');

Backbone.LocalStorage = require("backbone.localstorage");

exports = module.exports = Backbone.Model.extend({

	localStorage: new Backbone.LocalStorage("badges"),

	defaults: {
		statusUnreadNum: 0,
		messageUnreadNum: 0,
		chatUnreadNum: 0,
	},
});
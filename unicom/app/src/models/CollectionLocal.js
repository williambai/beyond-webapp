var Backbone = require('backbone');

Backbone.LocalStorage = require("backbone.localstorage");

exports = module.exports = Backbone.Collection.extend({

	localStorage: new Backbone.LocalStorage("collectionName"),

});
var Backbone = require('backbone');
var StatusCollection = require('./StatusCollection');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	url: config.api.host + '/accounts',

	defaults: {
		email: '',
		password:'',
		username: '',
		realname: '',
		avatar: '',
		biography: ''
	},

	initialize: function(){
		this.status = new StatusCollection();
		this.status.url = config.api.host + '/accounts' + this.id + '/status';
		this.activity = new StatusCollection();
		this.activity.url = config.api.host + '/accounts' + this.id + '/activity';
	}
});

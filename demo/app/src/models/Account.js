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
		this.status.url = '/accounts' + this.id + '/status';
		this.activity = new StatusCollection();
		this.activity.url = '/accounts' + this.id + '/activity';
	}
});

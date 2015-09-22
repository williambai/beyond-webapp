var Backbone = require('backbone');
var StatusCollection = require('./StatusCollection');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	url: '/accounts',

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

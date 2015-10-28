var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	addFriendTemplate = require('../../assets/templates/friendAdd.tpl'),
	AccountListView = require('./_ListAccount');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.account = options.account;
		this.friends = options.friends || [];
	},

	events: {
		'submit form': 'search'
	},

	search: function() {
		var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
		var url = config.api.host + '/accounts?type=search' +
			'&searchStr=' +
			$('input[name=searchStr]').val() + emailDomain;
		var ignoreIds = _.pluck(this.friends,'_id');
			ignoreIds.push(this.account.id);
			
		var accountListView = new AccountListView({
			url: url,
			ignoreIds: ignoreIds
		});
		accountListView.trigger('refresh',url);
		return false;
	},

	render: function() {
		this.$el.html(addFriendTemplate({
			account: this.account
		}));
		return this;
	}
});
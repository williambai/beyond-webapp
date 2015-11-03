var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	addFriendTemplate = require('../templates/friendAdd.tpl'),
	AccountListView = require('./_ListAccount');
var AccountSearchView = require('./_SearchAccount');

var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.router = options.router;
		this.searchStr = options.searchStr;
		this.account = options.account;
		this.friends = options.friends || [];
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
	},

	load: function() {
		var that = this;

		//ignore my friends and me	
		var ignoreIds = _.pluck(this.friends, '_id');
		ignoreIds.push(this.account.id);

		var emailDomain = that.account.email.substr(that.account.email.indexOf('@'));
		that.accountListView = new AccountListView({
			url: config.api.host +
				'/accounts?type=search' +
				'&searchStr=' +
				this.searchStr + emailDomain,
			ignoreIds: ignoreIds
		});
		that.accountListView.trigger('load');

		this.accountSearchView = new AccountSearchView({
			searchStr: that.searchStr
		});

		this.accountSearchView.done = function(query) {
			that.router.navigate('friend/add/search/' + query.searchStr, {
				replace: true,
				trigger: true
			});
		};
	},

	scroll: function(){
		this.accountListView.scroll();
		return false;
	},

	render: function() {
		this.$el.html(addFriendTemplate({
			account: this.account
		}));
		return this;
	}
});
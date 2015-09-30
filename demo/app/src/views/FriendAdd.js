var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    addFriendTemplate = require('../../assets/templates/friendAdd.tpl'),
    FriendListView = require('./_ListAccount');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.account = options.account;
	},

	events: {
		'submit form': 'search'
	},

	search: function(){
		var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
		var url = '/accounts?type=search' + 
				'&searchStr=' + 
				$('input[name=searchStr]').val() + emailDomain;
		var contactListView = new FriendListView({url: url});
		contactListView.trigger('load');
		return false;
	},

	render: function(){
		this.$el.html(addFriendTemplate({account: this.account}));
		return this;
	}
});
var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    userIndexTemplate = require('../../assets/templates/userIndex.tpl'),
    SearchUserView = require('./_SearchUser'),
    UserListView = require('./_ListUser');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#content',

	initialize: function(options){
		this.account = options.account;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
	},

	load: function(){
		var that = this;
		this.userListView = new UserListView({
			account: this.account,
			url: config.api.host + '/accounts'
		});
		this.searchUserView = new SearchUserView();
		this.searchUserView.done = function(url){
			that.userListView.trigger('refresh', url);
		};
		this.userListView.trigger('load');
	},
	scroll: function(){
		this.userListView.scroll();
		return false;
	},

	render: function(){
		this.$el.html(userIndexTemplate());
		return this;
	}
});
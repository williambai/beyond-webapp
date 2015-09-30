var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    friendsTemplate = require('../../assets/templates/friends.tpl'),
    ListView = require('./_ListFriend'),
    FriendCollection = require('../models/FriendCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		this.accountId = options.id;
		this.on('load', this.load, this);
	},

	load: function(){
		this.load = true;
		var url = '/friends/account/' + this.accountId;
		var listView = new ListView({url: url});
		listView.trigger('load');
	},

	render: function(){
		this.$el.html(friendsTemplate());
		return this;
	}

});
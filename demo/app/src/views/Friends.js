var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    friendsTemplate = require('../templates/friends.tpl'),
    ListView = require('./_ListFriend'),
    FriendCollection = require('../models/FriendCollection');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		this.load = true;
		var url = config.api.host + '/friends/account';
		var listView = new ListView({url: url});
		listView.trigger('load');
	},

	render: function(){
		this.$el.html(friendsTemplate());
		return this;
	}

});
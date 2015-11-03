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
	events: {
		'scroll': 'scroll',
	},

	load: function(){
		this.load = true;
		var url = config.api.host + '/account/friends';
		this.listView = new ListView({url: url});
		this.listView.trigger('load');
	},

	scroll: function(){
		this.listView.scroll();
		return false;
	},

	render: function(){
		this.$el.html(friendsTemplate());
		return this;
	}

});
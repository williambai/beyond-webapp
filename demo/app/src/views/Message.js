var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    messageTemplate = require('../../assets/templates/message.tpl'),
    StatusFormView = require('./_FormStatus'),
    StatusListView = require('./_ListStatus'),
    StatusView = require('./_ItemStatus1');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		if(options.socketEvents){
			options.socketEvents.on('socket:in:message',this.onSocketMessageAdded, this);
		}
		this.on('load', this.load, this);
	},
	events: {
		'scroll': 'scroll',
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.statusListView = new StatusListView({
			StatusView: StatusView,
			el: 'div.status-list',
			url: '/messages/account/exchange/'+ this.id,
			account: this.account,
		});
		this.statusListView.trigger('load');
	},

	scroll: function(){
		this.statusListView.scroll();
		return false;
	},

	onSocketMessageAdded: function(data){
		var from = data.from;
		var content = data.content;
		var status = {};
		status.fromId = from.id;
		status.fromUser = {};
		status.fromUser[from.id] = from;
		status.content = content;
		this.statusListView.collection.trigger('add:prepend',status);
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(messageTemplate());
		}
		return this;
	},
});
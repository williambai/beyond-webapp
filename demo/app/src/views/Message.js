var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    messageTemplate = require('../../assets/templates/message.tpl'),
    SearchView = require('./_SearchMessage'),
    ListView = require('./_ListMessage');
var config = require('../conf');

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
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			url: config.api.host + '/messages/account/me',
			account: this.account,
		});
		this.searchView = new SearchView();
		this.searchView.done = function(query){
			that.listView.trigger('refresh',config.api.host + '/messages/account/me?' + query);
		};
		this.listView.trigger('load');
		this.searchView.trigger('load');
	},

	scroll: function(){
		this.listView.scroll();
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
		this.listView.trigger('prepend',status);
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
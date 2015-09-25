var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    spaceTemplate = require('../../assets/templates/space.tpl'),
    StatusListView = require('./_ListStatus');

Backbone.$ = $;

exports = module.exports =Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'scroll': 'scroll',
	},

	initialize: function(options){
		this.id = options.id;
		if(options.id == 'me' || options.id == options.account.id){
			this.me = true;
		}else{
			this.me = false;
		}
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.statusListView = new StatusListView({
			el: 'div.status-list',
			url: '/statuses/account/' + this.id,
			account: this.account,
		});
		this.statusListView.trigger('load');
	},

	scroll: function(){
		this.statusListView.scroll();
		return false;
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate({me: this.me}));
		}else{
			this.$el.html(spaceTemplate({me: this.me}));
		}
		return this;
	},
});
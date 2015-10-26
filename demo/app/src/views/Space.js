var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    spaceTemplate = require('../../assets/templates/space.tpl'),
    MessageFormView = require('./_FormMessage'),
    StatusListView = require('./_ListStatus');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports =Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .editor-toggle': 'editorToggle',
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
			el: '#list',
			url: config.api.host + '/statuses/account/' + this.id,
			account: this.account,
		});
		this.statusListView.trigger('load');
	},

	editorToggle: function(){
		var that = this;
		if(this.$('.status-editor form').length == 0){
			var messageFormView = new MessageFormView({
				el: '.status-editor',
				fid: that.id,
				socketEvents: that.socketEvents
			});
			messageFormView.done = function(status){
				that.$('#feedback').html('私信已发送成功');
			};
			messageFormView.render();
			this.$('.status-editor form').addClass('');

			this.messageFormView = messageFormView;
			return false;
		}
		if(this.$('.status-editor form').hasClass('hidden')){
			this.messageFormView.reset();
			that.$('#feedback').empty();
			this.$('.status-editor form').removeClass('hidden');
		}else{
			this.$('.status-editor form').addClass('hidden');
		}
		return false;
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
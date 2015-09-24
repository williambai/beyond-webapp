var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    activityTemplate = require('../../assets/templates/space.tpl'),
    StatusFormView = require('./_FormStatus'),
    StatusListView = require('./_ListStatus');

Backbone.$ = $;

exports = module.exports =Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .editor-toggle': 'editorToggle',
		'scroll': 'scroll',
	},

	pageEvents: _.extend({},Backbone.Events),

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

	editorToggle: function(){
		if(this.$('.status-editor form').length == 0){
			var formView = new StatusFormView({
				el: '.status-editor',
			});
			formView.on('form:submit', this.formSubmit, this);
			formView.render();
			this.$('.status-editor form').addClass('');
			return false;
		}
		if(this.$('.status-editor form').hasClass('hidden')){
			this.$('.status-editor form').removeClass('hidden');
		}else{
			this.$('.status-editor form').addClass('hidden');
		}
		return false;
	},

	formSubmit: function(form){
		var that = this;
		var text = form.text;
		var attachments = form.attachments;
		var content = {
			MsgType: 'mixed',
			Content: text,
			Urls: attachments
		};

		$.ajax('/accounts/' + that.id,{
			method: 'GET',
			success: function(data){
				var message = {
						to: {
							id: data._id,
							username: data.username,
							avatar: data.avatar
						},
						content: content,
					};

				that.socketEvents.trigger('socket:out:message', message);

			}
		});
	
	},

	scroll: function(){
		this.statusListView.scroll();
		return false;
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate({me: this.me}));
		}else{
			this.$el.html(activityTemplate({me: this.me}));
		}
		return this;
	},
});
var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    activityTemplate = require('../../assets/templates/activity.tpl'),
    StatusFormView = require('./_FormStatus'),
    StatusListView = require('./_ListStatus');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .editor-toggle': 'editorToggle',
		'scroll': 'scroll',
	},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		if(options.socketEvents){
			options.socketEvents.on('socket:in:status',this.onSocketStatusAdded, this);
		}
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.statusListView = new StatusListView({
			el: '#list',
			url: '/activities/account/' + this.id,
			account: this.account,
		});
		this.statusListView.trigger('load');
	},

	editorToggle: function(){
		var that = this;
		if(this.$('.status-editor form').length == 0){
			var statusFormView = new StatusFormView({
				el: '.status-editor',
			});
			statusFormView.success = function(status){
				that.statusListView.trigger('prepend',status);
			};
			statusFormView.render();
			this.$('.status-editor form').addClass('');

			this.statusFormView = statusFormView;
			return false;
		}
		if(this.$('.status-editor form').hasClass('hidden')){
			this.statusFormView.reset();
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

	onSocketStatusAdded: function(status){
		this.statusListView.trigger('prepend',status);
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(activityTemplate());
		}
		return this;
	},
});
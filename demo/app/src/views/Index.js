var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    indexTemplate = require('../../assets/templates/index.tpl'),
    ProjectSearchView = require('./_SearchProject'),
    ProjectListView = require('./_ListProject2');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		this.loaded = true;
		this.render();
		this.hotListView = new ProjectListView({
			el: '#hot',
			socketEvents: this.socketEvents
		});
		this.topListView = new ProjectListView({
			el: '#top',
			socketEvents: this.socketEvents
		});
		this.topListView.trigger('load');
		this.hotListView.trigger('load');
		this.projectSearchView = new ProjectSearchView();
		this.projectSearchView.done = function(url){
			window.location.hash = url;
		};
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(indexTemplate());
		}
		return this;
	},
});
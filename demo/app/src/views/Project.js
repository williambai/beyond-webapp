var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    projectTemplate = require('../../assets/templates/projects.tpl'),
    SearchView = require('./_SearchProjectMy'),
    ListView = require('./_ListProject2');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
			socketEvents: this.socketEvents
		});
		this.searchView = new SearchView({

		});
		this.searchView.done = function(url){
			that.listView.trigger('refresh',url);
		};
		this.listView.trigger('load');
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(projectTemplate());
		}
		return this;
	},
});
var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../templates/loading.tpl'),
    projectTemplate = require('../templates/projectMy.tpl'),
    SearchView = require('./_SearchProjectMy'),
    ListView = require('./_ListProject2');
var config = require('../conf');

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
			el: '#project-widget',
			url: config.api.host + '/project/accounts?type=me',
			socketEvents: this.socketEvents
		});
		this.searchView = new SearchView({

		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh',config.api.host + '/project/accounts?' + query);
		};
		this.listView.trigger('load');
		this.searchView.trigger('load');
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
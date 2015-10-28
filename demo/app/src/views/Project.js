var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../../assets/templates/loading.tpl'),
	projectTemplate = require('../../assets/templates/projects.tpl'),
	SearchView = require('./_SearchProject'),
	ListView = require('./_ListProject2');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	initialize: function(options) {
		this.type = options.type || '';
		this.searchStr = options.searchStr || '';
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		var url = config.api.host + '/projects';
		if(this.type == 'search'){
			url = config.api.host + '/projects?type=search&searchStr=' + that.searchStr;
		}else if(this.type == 'hot'){
			url = config.api.host + '/projects?type=hot';
		}else if(this.type == 'top'){
			url = config.api.host + '/projects?type=top';
		}
		this.listView = new ListView({
			el: '#list',
			url: url,
			socketEvents: this.socketEvents
		});
		this.searchView = new SearchView({
			searchStr: this.searchStr
		});
		this.searchView.done = function(query) {
			that.listView.trigger('refresh', config.api.host + '/projects?' + 'type=search&searchStr=' + query.searchStr);
		};
		this.listView.trigger('load');
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(projectTemplate());
		}
		return this;
	},
});
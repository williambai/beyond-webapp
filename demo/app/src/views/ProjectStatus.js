var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	projectStatusTemplate = require('../../assets/templates/projectStatus.tpl'),
	bottomBarTemplate = require('../../assets/templates/_barProject.tpl'),
	StatusListView = require('./_ListProjectStatus'),
	Status = require('../models/Status'),
	StatusCollection = require('../models/StatusCollection');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'scroll': 'scroll',
	},

	initialize: function(options) {
		this.pid = options.pid;
		this.on('load', this.load, this);
	},

	load: function() {
		this.loaded = true;
		this.render();
		this.statusListView = new StatusListView({
			el: 'div.status_list',
			url: config.api.host + '/statuses/project/' + this.pid,
		});
		this.statusListView.isScrollUp = false;
		this.statusListView.trigger('load');
	},

	scroll: function() {
		this.statusListView && this.statusListView.trigger('scroll:down');
		return false;
	},

	render: function() {
		//增加 bottom Bar
		if ($('.navbar-absolute-bottom').length == 0) {
			var bottomBarHtml = bottomBarTemplate({
				id: this.pid
			});
			$('.app').prepend('<div class="bottom-bar">' + bottomBarHtml + '</div>');
			if (!$('body').hasClass('has-navbar-bottom')) {
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(projectStatusTemplate({
			model: {
				_id: this.pid,
				name: '动态'
			}
		}));
		return this;
	},
});
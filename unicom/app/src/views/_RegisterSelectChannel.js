var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView');
var accountTpl = require('../templates/_entityMyAccount.tpl');

var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#searchTemplate',

	initialize: function(options) {
		this.parentView = options.parentView;
		var page = $(accountTpl);
		var channelSearchTemplate = $('#channelSearchTemplate', page).html();
		this.template = _.template(_.unescape(channelSearchTemplate || ''));
		// FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .back': 'back',
	},

	back: function(){
		this.parentView.trigger('back');
	},

	done: function(){
		this.$el.html(this.successTemplate());
	},
	render: function(){
		this.$el.html(this.template());
		return this;
	},
});
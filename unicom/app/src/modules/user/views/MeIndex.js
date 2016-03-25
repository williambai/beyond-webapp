var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    meTpl = require('../templates/_entityMe.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(meTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
		'click #changepass': 'changepass',
		'click #bank': 'bank',
		'click #bonus': 'bonus',
		'click #sale': 'sale',
		'click #person_rank': 'person_rank',
		'click #group_rank': 'group_rank',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	back: function(){
		this.$el.html(this.template());
		return false;
	},

	changepass: function(evt){
		this.router.navigate('me/changepass',{trigger: true, replace: false});
		return false;
	},

	bank: function(evt){
		this.router.navigate('me/bank',{trigger: true, replace: false});
		return false;
	},

	bonus: function(evt){
		this.router.navigate('me/bonus',{trigger: true, replace: false});
		return false;
	},

	sale: function(evt){
		this.router.navigate('order/index',{trigger: true, replace: false});
		return false;
	},

	person_rank: function(evt){
		this.router.navigate('/rank/person',{trigger: true, replace: false});
		return false;
	},

	group_rank: function(evt){
		this.router.navigate('/rank/team',{trigger: true, replace: false});
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});
var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-help-index').html()),
	policyTemplate: _.template($('#tpl-help-policy').html()),
	faqTemplate: _.template($('#tpl-help-faq').html()),
	saleTemplate: _.template($('#tpl-help-sale').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
		'click #experience': 'feedbackIndex',
		'click #policy': 'policyView',
		'click #faq': 'faqView',
		'click #sale': 'saleView',
		'click #feedback': 'feedbackAdd',
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

	policyView: function(evt){
		// this.$el.before('<div style="width:100%;height:40px;padding:2px;background-color:lightgrey;"><button class="btn btn-default back">返回帮助中心</button></div>');
		this.$el.html(this.policyTemplate());
		return false;
	},

	faqView: function(evt){
		this.$el.html(this.faqTemplate());
		return false;
	},

	saleView: function(evt){
		this.$el.html(this.saleTemplate());
		return false;
	},

	feedbackIndex: function(evt){
		this.router.navigate('/feedback/index',{trigger: true, replace: true});
		return false;
	},
	feedbackAdd: function(evt){
		this.router.navigate('/feedback/add',{trigger: true, replace: true});
		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});
var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    helpTpl = require('../templates/_entityHelp.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(helpTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		var policyTpl = $('#policyTemplate', page).html();
		this.policyTemplate = _.template(_.unescape(policyTpl || ''));
		var faqTpl = $('#faqTemplate', page).html();
		this.faqTemplate = _.template(_.unescape(faqTpl || ''));
		var saleTpl = $('#saleTemplate', page).html();
		this.saleTemplate = _.template(_.unescape(saleTpl || ''));
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
		console.log(this.faqTemplate())
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
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});
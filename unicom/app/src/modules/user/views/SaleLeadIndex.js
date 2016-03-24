var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    leadTpl = require('../templates/_entitySaleLead.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');

Backbone.$ = $;

//** 模型
var SaleLead = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/sale/leads',	
	defaults: {
		customer: {}
	},
});
//** 集合
var SaleLeadCollection = Backbone.Collection.extend({
	model: SaleLead,
	url: config.api.host + '/private/sale/leads',
});

var SaleLeadListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(leadTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new SaleLeadCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(leadTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addSaleLead',
		'click .edit': 'editSaleLead',
		'click .delete': 'removeSaleLead',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new SaleLeadListView({
			el: '#list',
		});

		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addSaleLead: function(){
		this.router.navigate('sale/lead/add',{trigger: true});
		return false;
	},

	editSaleLead: function(evt){
		var id = this.$(evt.currentTarget).parent().parent().attr('id');
		this.router.navigate('sale/lead/edit/'+ id,{trigger: true});
		return false;
	},

	removeSaleLead: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().parent().attr('id');
			var model = new SaleLead({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
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
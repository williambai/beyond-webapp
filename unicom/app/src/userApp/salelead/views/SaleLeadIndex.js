var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');
var ListView = require('../../_base/__ListView');
var Utils = require('../../_base/__Util');

Backbone.$ = $;

//** 模型
var SaleLead = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/sale/leads',	
	defaults: {
		customer: {},
		product: {}
	},
});
//** 集合
var SaleLeadCollection = Backbone.Collection.extend({
	model: SaleLead,
	url: config.api.host + '/private/sale/leads',
});

var SaleLeadListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-sale-item').html()),

	initialize: function(options){
		this.collection = new SaleLeadCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		model.set('deltatime',Utils.transformTime(model.get('lastupdatetime')));
		return this.template({model: model.toJSON()});
	},
});

exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-sale-index').html()),

	initialize: function(options) {
		this.router = options.router;
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
		this.$el.html(this.template());
		return this;
	},
});
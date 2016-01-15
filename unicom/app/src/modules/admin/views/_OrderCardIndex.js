var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    cardTpl = require('../templates/_entityOrderCard.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var OrderCard = require('../models/OrderCard');
var ListView = require('./_OrderCardList');
var SearchView = require('./_OrderCardSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(cardTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addOrderCard',
		'click .view': 'viewOrderCard',
		'click .delete': 'removeOrderCard',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new SearchView({
			el: '#search',
		});
		this.listView = new ListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addOrderCard: function(){
		this.router.navigate('order/card/add',{trigger: true});
		return false;
	},

	viewOrderCard: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('order/card/view/'+ id,{trigger: true});
		return false;
	},

	removeOrderCard: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new OrderCard({_id: id});
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
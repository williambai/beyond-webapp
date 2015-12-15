var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');
var cardPackge = require('../models/ProductCardPackage');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#package',

	initialize: function(options){
		this.model = new SearchModel();
		var page = $(cardTpl);
		var searchTemplate = $('#packageTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.on('load', this.load,this);
	},

	events: {
		'click .tabControl': 'tabControl',
		'click .selectItem': 'selectItem',
		'submit form': 'submit',
	},

	load: function(){
		this.render();
		//show first tab
		this.$('div.tabControl').first().removeClass('btn-default').addClass('btn-success');
		this.$('div.tab').hide();
		this.$('div.tab').first().show();
		this.trigger('ready');
	},

	tabControl: function(evt){
		var target = evt.currentTarget;
		var index = $(target).index();
		//toggle tabs
		$(target).siblings('div.btn-success').removeClass('btn-success').addClass('btn-default');
		$(target).removeClass('btn-default').addClass('btn-success');
		//change tab content
		this.$('.tab').hide();
		$(this.$('.tab')[index]).show();
		return false;
	},
	
	selectItem: function(evt){
		var target = evt.currentTarget;
		var radio = $(target).find('input[type=radio]');
		if(radio.attr('checked')){
			$(target).removeClass('bg-success').addClass('bg-info');
			radio.removeAttr('checked');
		}else{
			$(target).removeClass('bg-info').addClass('bg-success');
			radio.attr('checked',true);
		}
		return false;
	},

	submit: function(){
		var products = [];
		var object = this.$('form').serializeJSON() || {};
		if(_.isEmpty(object.product)) return false;
		var values = _.values(object.product)
		// console.log(cardPackge)
		// console.log(values);
		_.each(values,function(value){
			if(_.has(cardPackge,value))
				return products.push(cardPackge[value]);
		});
		// console.log(products);
		this.done(products);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
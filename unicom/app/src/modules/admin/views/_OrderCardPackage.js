var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    cardTpl = require('../templates/_entityOrderCard.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#packages',

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
		'click #closePackages': 'close',
	},

	load: function(){
		var that = this;
		this.render();
		// $.ajax({
		// 	url: config.api.host + '/product/card/packages',
		// 	type: 'GET',
		// 	xhrFields: {
		// 		withCredentials: true
		// 	}
		// }).done(function(data){
		// 	var packageA = _.

		// });
		//show first tab
		that.$('div.tabControl').first().removeClass('btn-default').addClass('btn-success');
		that.$('div.tab').hide();
		that.$('div.tab').first().show();
	},

	tabControl: function(evt){
		var target = evt.currentTarget;
		var index = $(target).index();
		//reset
		this.$('input[type=radio]').removeAttr('checked');
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

	close: function(){
		var packageStr = '';
		this.$('input[type=radio]:checked')
			.each(function(){
				packageStr += $(this).val() + ';';
			});
		this.done(packageStr.slice(0,-1));
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
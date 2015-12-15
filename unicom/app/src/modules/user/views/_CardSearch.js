var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(cardTpl);
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.model = new SearchModel();
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'search',
		'reset form': 'reset',
	},

	load: function(){
		this.render();
		this.trigger('ready');
	},

	search: function(){
		var object = this.$('form').serializeJSON();
		this.done(object);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
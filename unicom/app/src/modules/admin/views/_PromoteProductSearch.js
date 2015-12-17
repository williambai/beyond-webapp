var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    dataTpl = require('../templates/_entityPromoteProduct.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(dataTpl);
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.model = new SearchModel();
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'search'
	},

	load: function(){
		this.render();
	},

	search: function(){
		var query = this.$('form').serialize();
		// console.log(query);
		this.done(query);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
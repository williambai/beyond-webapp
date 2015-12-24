var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    orderTpl = require('../templates/_entityOrder.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(orderTpl);
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
		var url = 'from=' + $('input[name=from]').val() + '&to=' + $('input[name=to]').val() + '&searchStr=' + $('input[name=searchStr]').val();
		this.done(url);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
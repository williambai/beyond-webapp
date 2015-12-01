var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#export',

	initialize: function(options){
		var page = $(strategyTpl);
		var exportTemplate = $('#exportTemplate', page).html();
		this.template = _.template(_.unescape(exportTemplate || ''));
		this.model = new SearchModel();
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'submit'
	},

	load: function(){
		this.render();
	},

	submit: function(){
		var object = this.$('form').serialize();
		window.location.href = '/export/strategy?' + object;
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
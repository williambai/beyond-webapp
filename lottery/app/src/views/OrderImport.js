var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    orderImportTemplate = require('../../assets/templates/orderImport.tpl');

Backbone.$ = $;

exports =module.exports = Backbone.View.extend({
	el: '#content',

	render: function(){
		this.$el.html(orderImportTemplate());
		return this;
	}
});

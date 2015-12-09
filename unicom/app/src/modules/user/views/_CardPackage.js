var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView');
var cardTpl = require('../templates/_entityCard.tpl');

var config = require('../conf');

var Backbone = require('backbone');
Backbone.$ = $;

exports = module.exports = FormView.extend({

	el: '#packageForm',

	initialize: function(options) {
		var page = $(cardTpl);
		var packageTemplate = $('#packageTemplate', page).html();
		this.template = _.template(_.unescape(packageTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit'
	},

	submit: function() {
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	done: function(){
		window.history.back();
	},
	
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
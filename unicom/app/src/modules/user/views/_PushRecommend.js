var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView');
var pushTpl = require('../templates/_entityPush.tpl');

var config = require('../conf');

var Backbone = require('backbone');
Backbone.$ = $;

var Model = Backbone.Model.extend({

});

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	initialize: function(options) {
		this.model = options.model || new Model();
		var page = $(pushTpl);
		var recommendTemplate = $('#recommendTemplate', page).html();
		this.template = _.template(_.unescape(recommendTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .back': 'back',
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

	back: function(){
		window.history.back();
	},

	done: function(){
		window.history.back();
	},
	
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView');
var cardTpl = require('../templates/_entityCard.tpl');

var config = require('../conf');

var Backbone = require('backbone');
Backbone.$ = $;

var PackageView = require('./_CardPackage');

var Model = Backbone.Model.extend({

});

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	initialize: function(options) {
		var page = $(cardTpl);
		var recommendTemplate = $('#recommendTemplate', page).html();
		this.template = _.template(_.unescape(recommendTemplate || ''));
		this.model = new Model();

		this.packageView = new PackageView({
			el: '#content',
			model: this.model,
		});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .back': 'back',
		'click #selectPackage': 'packageSearch',
		'submit form': 'submit'
	},

	packageSearch: function(){
		this.packageView.trigger('load');
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
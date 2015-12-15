var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
	ProductCardRecommend = require('../models/ProductCardRecommend');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductCardRecommend();
		var page = $(cardTpl);
		var recommendTemplate = $('#recommendTemplate', page).html();
		this.template = _.template(_.unescape(recommendTemplate || ''));
		var successTpl = $('#successTemplate', page).html();
		this.successTemplate = _.template(_.unescape(successTpl || ''));
		this.on('change:product', this.packageChanged, this);
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		var that = this;
		this.render();
		this.trigger('ready');
	},

	packageChanged: function(products){
		this.$('#hiddenFields').empty();
		var html = '';
		_.each(products,function(product){
			html += '<input type="hidden" name="package[]" value="' + product.id +'">';
		});
		this.$('#hiddenFields').html(html);
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	cancel: function(){
		this.router.navigate('card/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.$el.html(this.successTemplate());
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
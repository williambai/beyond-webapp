var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
	ProductCardOrder = require('../models/ProductCardOrder');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#orderForm',

	packages: [],

	initialize: function(options) {
		this.router = options.router;
		this.cardModel = options.cardModel;
		this.model = new ProductCardOrder();
		var page = $(cardTpl);
		var orderTemplate = $('#orderTemplate', page).html();
		this.template = _.template(_.unescape(orderTemplate || ''));
		var successTpl = $('#successTemplate', page).html();
		this.successTemplate = _.template(_.unescape(successTpl || ''));
		this.on('change:product', this.packageChanged, this);
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},

	load: function(){
		var that = this;
		this.render();
		this.trigger('ready');
	},

	packageChanged: function(packages){
		console.log(packages)
		this.packages = packages;
		this.$('#hiddenFields').empty();
		// var html = '';
		// _.each(packages,function(product){
		// 	html += '<input type="hidden" name="package[]" value="' + product.id +'">';
		// });
		// this.$('#hiddenFields').html(html);
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.
		
		//** set order form
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		//** set card model
		this.model.set('card', this.cardModel.toJSON());
		//** set packages model
		this.model.set('packages', this.packages);
		// console.log(this.model.toJSON());
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
var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    orderTpl = require('../templates/_entityData.tpl'),
	ProductDirectOrder = require('../models/ProductDirectOrder');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#orderForm',

	initialize: function(options) {
		this.router = options.router;
		this.product = options.product;
		this.model = new ProductDirectOrder();
		var page = $(orderTpl);
		var orderTemplate = $('#orderTemplate', page).html();
		this.template = _.template(_.unescape(orderTemplate || ''));
		var successTpl = $('#successTemplate', page).html();
		this.successTemplate = _.template(_.unescape(successTpl || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .addItem': 'addItem',
		'click .cancel': 'cancel',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
		this.trigger('ready');
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


	addItem: function(){
		this.$('#insertItemBefore').prepend('<div class="form-group"><label></label><input name="mobile[]" class="form-control" placeholder="手机号码"></div>');
		return false;
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
		//** set product model
		this.model.set('product', this.product.toJSON());
		// console.log(this.model.toJSON());
		var mobiles = this.model.get('mobile');
		mobiles = _.without(mobiles, '');
		if(_.isEmpty(mobiles)){
			var error = '至少需要一个手机';
			that.$('[name="mobile[]"]').parent().addClass('has-error');
			that.$('[name="mobile[]"]').parent().find('span.help-block').text(error);
			return false;
		};
		this.model.set('mobile', mobiles);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});			
		return false;
	},

	cancel: function(){
		window.history.back();
		// this.router.navigate('promote/product/index',{trigger: true, replace: true});
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
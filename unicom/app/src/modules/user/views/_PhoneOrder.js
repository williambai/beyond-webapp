var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityPhone.tpl'),
	ProductPhoneOrder = require('../models/ProductPhoneOrder');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#orderForm',

	modelFilled: false,

	packages: [],

	initialize: function(options) {
		this.router = options.router;
		this.phoneModel = options.phoneModel;
		this.model = new ProductPhoneOrder();
		var page = $(productTpl);
		var orderTemplate = $('#orderTemplate', page).html();
		this.template = _.template(_.unescape(orderTemplate || ''));
		var successTpl = $('#successTemplate', page).html();
		this.successTemplate = _.template(_.unescape(successTpl || ''));
		this.on('change:packages', this.packageChanged, this);
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
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

	packageChanged: function(packages){
		console.log(packages)
		this.packages = packages;
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
		//** set phone model
		this.model.set('phone', this.phoneModel.toJSON());
		//** set packages model
		this.model.set('packages', this.packages);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	
	cancel: function(){
		this.router.navigate('phone/index',{trigger: true, replace: true});
		return false;
	},
	
	done: function(response){
		this.$el.html(this.successTemplate());
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('#panel-title').text('推荐终端');
		// //set image
		// var thumbnail_url = this.model.get('thumbnail_url');
		// if(thumbnail_url) that.$('img#thumbnail_url').attr('src',thumbnail_url);
		return this;
	},
});
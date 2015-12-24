var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Register = require('../models/Register');
var accountTpl = require('../templates/_entityMyAccount.tpl');

var SelectChannelView = require('./_MyAccountSelectChannel');

exports = module.exports = FormView.extend({

	el: '#registerForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var registerTemplate = $('#registerTemplate', page).html();
		this.template = _.template(_.unescape(registerTemplate || ''));
		var registerSuccessTemplate = $('#registerSuccessTemplate', page).html();
		this.successTemplate = _.template(_.unescape(registerSuccessTemplate || ''));
		this.model = new Register();

		this.selectChannelView = new SelectChannelView({
			el: '#content',
			parentView: this,
		});
		this.on('back', this.render,this);

		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'blur input[type=text]': 'inputText',
		'keyup input[type=password]': 'inputText',
		'click #selectChannel': 'selectChannel',
		'submit form': 'register',
		'swipeleft': 'swipeToLoginForm',
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

	selectChannel: function(){
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		this.selectChannelView.render();
		return false;
	},

	register: function() {
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

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		console.log(this.model.toJSON());
		var password = this.model.get('password');
		var cpasword = this.model.get('cpasword');
		if(password != cpasword){
			var error = '两次输入不同';
			that.$('[name="cpassword"]').parent().addClass('has-error');
			that.$('[name="cpassword"]').parent().find('span.help-block').text(error);			
			return false;
		}
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	swipeToLoginForm: function() {
		window.location.hash = 'login';
		return false;
	},

	done: function() {
		this.$el.html(this.successTemplate());
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});
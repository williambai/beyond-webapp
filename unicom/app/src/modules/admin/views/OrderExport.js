var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    orderTpl = require('../templates/_entityOrder.tpl');
var config = require('../conf');

Backbone.$ = $;

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/orders',	
	defaults: {
		customer: {},
		goods: {},
		customerInfo: {},
		bonus: {
			cash: 0,
			points: 0,
		},
		createBy: {},
		department: {},
	},
	validation: {
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#exportForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new (Backbone.Model.extend({}));
		var page = $(orderTpl);
		var exportTemplate = $('#exportTemplate', page).html();
		this.template = _.template(_.unescape(exportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function() {
		if (this.model.isNew()) {
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	inputText: function(evt) {
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr, function(obj) {
			var error = that.model.preValidate(obj.name, obj.value);
			if (error) {
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);
			}
		})
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr, function(obj) {
			var error = that.model.preValidate(obj.name, obj.value);
			if (error) {
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if (!_.isEmpty(errors)) return false;
		//validate finished.

		var query = this.$('form').serialize();
		//download file
		window.location.href = config.api.host + '/protect/orders?' + query;
		return false;
	},

	cancel: function() {
		this.router.navigate('order/index', {
			trigger: true,
			replace: true
		});
		return false;
	},

	//fetch event: done
	done: function(response) {
		var that = this;
		if (!this.modelFilled) {
			//first fetch: get model
			this.modelFilled = true;
			this.render();

		} else {
			//second fetch: submit
			this.router.navigate('order/index', {
				trigger: true,
				replace: true
			});
		}
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});
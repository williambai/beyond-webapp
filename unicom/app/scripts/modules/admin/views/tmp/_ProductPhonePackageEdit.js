var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	productTpl = require('../templates/_entityProductPhonePackage.tpl'),
	ProductPhonePackage = require('../models/ProductPhonePackage');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#packageForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.pid = options.pid;
		this.model = new ProductPhonePackage({
			_id: options.id,
			pid: options.pid
		});
		var page = $(productTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="goods[name]"]': 'getGoods',
		'click li.list-group-item': 'selectGoods',
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
		});
		return false;
	},

	getGoods: function(evt) {
		this.$('#goods').empty();
		var that = this;
		var searchStr = this.$('input[name="goods[name]"]').val() || '';
		if (searchStr.length > 1) {
			$.ajax({
				url: config.api.host + '/goods?type=search&per=10&searchStr=' + searchStr,
				type: 'GET',
				fields: {
					withCredentials: true
				}
			}).done(function(data) {
				data = data || [];
				var goods = '<ul class="list-group">';
				data.forEach(function(item) {
					goods += '<li class="list-group-item">' +
						item.barcode + '|' +
						item.name + '|' +
						item.category + '|' +
						item.price + item.unit + '|' +
						item.quantity + '</li>';
				});
				goods += '</ul>';
				that.$('#goods').html(goods);
			});
		}
		return false;
	},

	selectGoods: function(evt) {
		var goods = $(evt.currentTarget).text().split('|');
		this.$('input[name="goods[id]"]').val(goods[0]);
		this.$('input[name="goods[name]"]').val(goods[1]);
		this.$('#goods').empty();
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

	cancel: function() {
		this.router.navigate('product/phone/'+ this.pid +'/package/index', {
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
			this.router.navigate('product/phone/'+ this.pid +'/package/index', {
				trigger: true,
				replace: true
			});
		}
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		if (this.model.isNew()) this.$('.panel-title').text('新增套餐');
		var status = this.model.get('status');
		this.$('input[name=status][value=' + status + ']').attr('checked', true);
		return this;
	},
});
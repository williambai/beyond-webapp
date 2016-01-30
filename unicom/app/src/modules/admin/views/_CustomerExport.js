var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	customerTpl = require('../templates/_entityCustomer.tpl'),
	Customer = require('../models/Customer');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#exportForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new (Backbone.Model.extend({}));
		var page = $(customerTpl);
		var exportTemplate = $('#exportTemplate', page).html();
		this.template = _.template(_.unescape(exportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="department"]': 'getDepartments',
		'click .department': 'selectDepartment',
		// 'keyup input[name="channel"]': 'getChannels',
		// 'click .channel': 'selectChannel',
		// 'keyup input[name="grid"]': 'getGrids',
		// 'click .grid': 'selectGrid',
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

	getDepartments: function(evt) {
		this.$('#departments').empty();
		var that = this;
		var searchStr = this.$(evt.currentTarget).val() || '';
		if (searchStr.length > 1) {
			$.ajax({
				url: config.api.host + '/departments?type=search&searchStr=' + searchStr,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data) {
				data = data || [];
				var departmentsView = '<ul>';
				data.forEach(function(item) {
					departmentsView += '<li class="department" id="' + item._id + '">' + item.path + '</li>';
				});
				departmentsView += '</ul>';
				that.$('#departments').html(departmentsView);
			});
		}
		return false;
	},

	selectDepartment: function(evt) {
		var id = this.$(evt.currentTarget).attr('id');
		var path = this.$(evt.currentTarget).text();
		this.$('input[name="department"]').val(path);
		this.$('#departments').empty();
		return false;
	},

	// getChannels: function(evt) {
	// 	this.$('#channels').empty();
	// 	var that = this;
	// 	var searchStr = this.$(evt.currentTarget).val() || '';
	// 	if (searchStr.length > 1) {
	// 		$.ajax({
	// 			url: config.api.host + '/channel/entities?type=search&searchStr=' + searchStr,
	// 			type: 'GET',
	// 			xhrFields: {
	// 				withCredentials: true
	// 			},
	// 		}).done(function(data) {
	// 			data = data || [];
	// 			var channelsView = '<ul>';
	// 			data.forEach(function(item) {
	// 				channelsView += '<li class="channel" id="' + item._id + '">' + item.name + '</li>';
	// 			});
	// 			channelsView += '</ul>';
	// 			that.$('#channels').html(channelsView);
	// 		});
	// 	}
	// 	return false;
	// },

	// selectChannel: function(evt) {
	// 	var id = this.$(evt.currentTarget).attr('id');
	// 	var name = this.$(evt.currentTarget).text();
	// 	this.$('input[name="channel"]').val(name);
	// 	this.$('#channels').empty();
	// 	return false;
	// },

	// getGrids: function(evt) {
	// 	this.$('#grids').empty();
	// 	var that = this;
	// 	var searchStr = this.$(evt.currentTarget).val() || '';
	// 	if (searchStr.length > 1) {
	// 		$.ajax({
	// 			url: config.api.host + '/channel/grids?type=search&searchStr=' + searchStr,
	// 			type: 'GET',
	// 			xhrFields: {
	// 				withCredentials: true
	// 			},
	// 		}).done(function(data) {
	// 			data = data || [];
	// 			var gridsView = '<ul>';
	// 			data.forEach(function(item) {
	// 				gridsView += '<li class="grid" id="' + item._id + '">' + item.name + '</li>';
	// 			});
	// 			gridsView += '</ul>';
	// 			that.$('#grids').html(gridsView);
	// 		});
	// 	}
	// 	return false;
	// },

	// selectGrid: function(evt) {
	// 	var id = this.$(evt.currentTarget).attr('id');
	// 	var name = this.$(evt.currentTarget).text();
	// 	this.$('input[name="grid"]').val(name);
	// 	this.$('#grids').empty();
	// 	return false;
	// },

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
		window.location.href = config.api.host + '/customers?' + query;
		return false;
	},

	cancel: function() {
		this.router.navigate('customer/index', {
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
			this.router.navigate('customer/index', {
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
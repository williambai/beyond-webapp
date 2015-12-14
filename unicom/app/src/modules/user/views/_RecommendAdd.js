var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    recommendTpl = require('../templates/_entityRecommend.tpl'),
	Recommend = require('../models/Recommend');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new Recommend();
		var page = $(recommendTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		var successTpl = $('#successTemplate', page).html();
		this.successTemplate = _.template(_.unescape(successTpl || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .addItem': 'addItem',
		'click .cancel': 'cancel',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
	},

	addItem: function(){
		this.$('#insertItemBefore').prepend('<div class="form-group"><label></label><input name="mobile[]" class="form-control" placeholder="手机号码"></div>');
		return false;
	},

	submit: function() {
		var that = this;
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
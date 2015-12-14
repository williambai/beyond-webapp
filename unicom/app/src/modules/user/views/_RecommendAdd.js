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
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
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
		window.history.back();
		// this.router.navigate('promote/product/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
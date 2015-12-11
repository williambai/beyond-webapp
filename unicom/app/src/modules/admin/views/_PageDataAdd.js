var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityPageData.tpl'),
	PageData = require('../models/PageData');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#dataForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new PageData();
		var page = $(dataTpl);
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
		this.router.navigate('page/data/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('page/data/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
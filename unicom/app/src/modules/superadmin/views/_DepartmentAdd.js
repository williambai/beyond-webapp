var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    departmentTpl = require('../templates/_entityDepartment.tpl'),
	Department = require('../models/Department');

exports = module.exports = FormView.extend({

	el: '#departmentForm',

	initialize: function(options) {
		var page = $(departmentTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		this.model = new Department();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		this.render();
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		if(object.status.code == 0){
			object.status.message = '无效';
		}else{
			object.status.message = '有效';
		}
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	done: function(response){
		window.location.hash = 'department/index';
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
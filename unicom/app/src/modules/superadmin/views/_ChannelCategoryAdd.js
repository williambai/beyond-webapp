var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    channelCategoryTpl = require('../templates/_entityChannelCategory.tpl'),
	Role = require('../models/Role');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		var page = $(channelCategoryTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		this.model = new Role();
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
		window.location.hash = 'channel/category/index';
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
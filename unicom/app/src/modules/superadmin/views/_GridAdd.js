var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    gridTpl = require('../templates/_entityGrid.tpl'),
	Grid = require('../models/Grid');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#gridForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new Grid();
		var page = $(gridTpl);
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
		this.router.navigate('grid/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('grid/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
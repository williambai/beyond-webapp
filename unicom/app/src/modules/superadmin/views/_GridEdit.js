var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    gridTpl = require('../templates/_entityGrid.tpl'),
	Grid = require('../models/Grid');

exports = module.exports = FormView.extend({

	el: '#gridForm',

	modelFilled: false,

	initialize: function(options) {
		var page = $(gridTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new Grid();
		this.model._id = options.id;
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		this.model.url = this.model.url + '/' + this.model._id;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
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
	
	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			window.location.hash = 'grid/index';
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
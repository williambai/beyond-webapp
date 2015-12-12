var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityData.tpl'),
	ProductData = require('../models/ProductData');
var config = require('../conf');

var OrderData = require('../models/OrderData');

exports = module.exports = FormView.extend({

	el: '#dataForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductData({_id: options.id});
		var page = $(dataTpl);
		var editTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		var order = new OrderData();
		order.set(object);
		// console.log(this.model.attributes);
		order.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('data/index',{trigger: true, replace: true});
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
			this.router.navigate('data/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var category = this.model.get('category');
		this.$('input[name=category][value='+ category +']').attr('checked',true);
		var status = this.model.get('status');
		this.$('input[name=status][value='+ status +']').attr('checked',true);
		return this;
	},
});
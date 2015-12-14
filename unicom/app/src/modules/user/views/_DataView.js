var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityData.tpl'),
	PromoteProduct = require('../models/PromoteProduct');
var config = require('../conf');

var Recommend = require('../models/Recommend');

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new PromoteProduct({_id: options.id});
		var page = $(dataTpl);
		var editTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .add': 'addItem',
		'click .back': 'cancel',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	addItem: function(){
		this.$('#insertItemBefore').prepend('<div class="form-group"><label></label><input name="mobile[]" class="form-control" placeholder="手机号码"></div>');
		return false;
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		var recommend = new Recommend();
		recommend.set(object);
		recommend.on('sync', this.done,this);
		// console.log(this.model.attributes);
		recommend.save(null, {
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
		console.log('++++')
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
		return this;
	},
});
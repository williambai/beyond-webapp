var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    recommendTpl = require('../templates/_entityPageRecommend.tpl'),
	PageRecommend = require('../models/PageRecommend');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#recommendForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new PageRecommend({_id: options.id});
		var page = $(recommendTpl);
		var editTemplate = $('#editTemplate', page).html();
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
		this.router.navigate('recommend/index',{trigger: true, replace: true});
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
			this.router.navigate('recommend/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
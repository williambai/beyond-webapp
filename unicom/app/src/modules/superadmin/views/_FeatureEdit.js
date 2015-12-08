var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    roleTpl = require('../templates/_entityFeature.tpl'),
	Feature = require('../models/Feature');

exports = module.exports = FormView.extend({

	el: '#featureForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Feature({_id: options.id});
		var page = $(roleTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.model.set('_id', this.id);
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
		console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	cancel: function(){
		this.router.navigate('feature/index',{trigger: true, replace: true});
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
			this.router.navigate('feature/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.get('category') == 'back'){
			this.$('input[name=category][value=back]').attr('checked',true);
		}
		if(this.model.get('category') == 'mobile'){
			this.$('input[name=category][value=mobile]').attr('checked',true);
		}
		var status = this.model.get('status');
		if(status.code == 1){
			this.$('input[name="status[code]"]').attr('checked',true);
		}
		return this;
	},
});
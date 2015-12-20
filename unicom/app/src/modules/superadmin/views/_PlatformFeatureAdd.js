var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    roleTpl = require('../templates/_entityPlatformFeature.tpl'),
	Feature = require('../models/PlatformFeature');

exports = module.exports = FormView.extend({

	el: '#featureForm',

	initialize: function(options) {
		this.router = options.router;
		var page = $(roleTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		this.model = new Feature();
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

	cancel: function(){
		this.router.navigate('feature/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('feature/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
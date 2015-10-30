var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    Project = require('../models/Project');

exports = module.exports = FormView.extend({

	el: '#projectForm',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.model = new Project();
		FormView.prototype.initialize.apply(this,options);
	},

	events: {
		'submit form': 'addProject'
	},

	addProject: function(){
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set model
		this.model.set('name',$('input[name=name]').val());
		this.model.set('description',$('textarea[name=description]').val());

		if(this.model.isValid()){
			var xhr = this.model.save(null, {
					xhrFields: {
						withCredentials: true
					},
				});
			if(xhr){
				xhr
					.success(function(data){
						if(!!data.code){
							that.$('#error').html('<div class="alert alert-dander">' + data.errmsg + '</div>');
							that.$('#error').slideDown();
							return;
						}
						//update UI
						that.done(data);
						//trigger socket.io
						that.socketEvents.trigger('app:projects:reload');
					})
					.error(function(xhr){
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}
		}

		return false;
	},

});

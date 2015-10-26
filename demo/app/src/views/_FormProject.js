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
		this.model.set('name',$('input[name=name]').val());
		this.model.set('description',$('textarea[name=description]').val());
		var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
		if(xhr){
			xhr
				.success(function(data){
					if(!!data.code){
						that.$('#error').html('<div class="alert alert-dander">' + data.message + '</div>');
						that.$('#error').slideDown();
						return;
					}
					//update UI
					that.done();
					//trigger socket.io
					that.socketEvents.trigger('app:projects:reload');
				})
				.error(function(err){
					console.log(err);
					that.$('#error').html('<div class="alert alert-danger">unknown error</div>');
					that.$('#error').slideDown();
				});
		}
		return false;
	},

});

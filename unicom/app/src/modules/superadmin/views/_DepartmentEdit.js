var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    departmentTpl = require('../templates/_entityDepartment.tpl'),
	Department = require('../models/Department');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#departmentForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Department({_id: options.id});
		var page = $(departmentTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
		'keyup input[name=parent]': 'getParentList',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	getParentList: function(evt){
		this.$('#departments').empty();
		var that = this;
		var searchStr = this.$(evt.currentTarget).val() || '';
		if(searchStr.length >1){
			$.ajax({
				url: config.api.host + '/channel/departments?type=search&searchStr=' + searchStr,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data){
				data = data || [];
				var departments = '';
				data.forEach(function(item){
					departments += '<option label="'+ item.name +'" value="'+ item._id +'">';
				});
				that.$('#departments').html(departments);
			});				
		}
		return false;
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
		this.router.navigate('department/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();

		}else{
			//second fetch: submit
			this.router.navigate('department/index',{trigger: true, replace: true});
		}
	},
	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			window.location.hash = 'department/index';
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
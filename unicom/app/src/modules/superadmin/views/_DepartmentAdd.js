var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    departmentTpl = require('../templates/_entityDepartment.tpl'),
	Department = require('../models/Department');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#departmentForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new Department();
		var page = $(departmentTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
		'keyup input[name=parent_name]': 'getParentList',
	},

	load: function(){
		this.render();
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
					departments += '<input type="radio" name="parent" value="'+ item._id +'">&nbsp;'+ item.name +'&nbsp' + '<br/>';
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

	done: function(response){
		this.router.navigate('department/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
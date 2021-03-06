var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    categoryTpl = require('../templates/_entityProductCategory.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var ProductCategory = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/product/categories',

	validation: {
		name: {
			required : true,
			msg: '请输入名称'
		},
	},
});
//** 主视图
exports = module.exports = FormView.extend({

	el: '#categoryForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductCategory({_id: options.id});
		var page = $(categoryTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.

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
		this.router.navigate('product/category/index',{trigger: true, replace: true});
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
			this.router.navigate('product/category/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		if(status) this.$('input[name=status][value='+ status +']').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增分类');
		return this;
	},
});
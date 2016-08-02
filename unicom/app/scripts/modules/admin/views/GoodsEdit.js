var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    goodsTpl = require('../templates/_entityGoods.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Goods = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/goods',	
	defaults: {
	},
	validation: {
	    'name': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'barcode': {
			required: true,
			msg: '请输入运营商系统的业务编码'
	    },
	    'smscode': {
	    	min: 0,
	    	max: 99999999,
	    	msg:'请输入八位以内的数字'
	    },
	    'packagecode': {
	    	pattern: /^(p\d*k\d*e\d*){1,}/,
	    	msg: '格式不对：p{package_id}k{package_id}e{element_id}，多个以|分开'
	    }
	},
});

//** 主页面
exports = module.exports = FormView.extend({

	el: '#goodsForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Goods({_id: options.id});
		var page = $(goodsTpl);
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
		this.router.navigate('goods/index',{trigger: true, replace: true});
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
			this.router.navigate('goods/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()){
			this.$('.panel-title').text('新增物料');
		}
		var category = this.model.get('category');
		this.$(('input[name=category][value='+ category +']')).attr('checked',true)
		var scope = this.model.get('scope');
		this.$(('input[name=scope][value='+ scope +']')).attr('checked',true)

		var paymenttype = this.model.get('paymenttype');
		if(paymenttype){
			this.$('input[name=paymenttype][value='+ paymenttype +']').attr('checked',true);
		}

		var status = this.model.get('status');
		if(status){
			this.$('input[name=status][value='+ status +']').attr('checked',true);
		}
		return this;
	},
});
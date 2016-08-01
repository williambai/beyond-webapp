var _ = require('underscore');
var Backbone = require('backbone');
var	$ = require('jquery');
var config = require('../../conf');
var FormView = require('../../_base/__FormView');

Backbone.$ = $;

//** Product模型
var Product = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/products',	
	defaults: {
		goods: {},
	},
});

//** Order模型
var ProductOrder = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/orders',	

	validation: {
		'mobile[]': {
			pattern: /^(186|185|156|131|130|155|132)\d{8}$/,
			msg: '请输入有效的联通手机号码'
		},
	}
});

//** OrderForm子视图
var OrderView = FormView.extend({

	el: '#orderForm',
	template: _.template($('#tpl-product-order').html()),
	successTemplate: _.template($('#tpl-order-success').html()),

	initialize: function(options) {
		this.router = options.router;
		this.product = options.product;
		this.model = new ProductOrder();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .addItem': 'addItem',
		'click .cancel': 'cancel',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
		this.trigger('ready');
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


	addItem: function(){
		this.$('#insertItemBefore').prepend('<div class="form-group"><label></label><input name="mobile[]" class="form-control" placeholder="手机号码"></div>');
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

		//** set order form
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		//** set product model
		this.model.set('product', this.product.toJSON());
		// console.log(this.model.toJSON());
		var mobiles = this.model.get('mobile');
		mobiles = _.without(mobiles, '');
		if(_.isEmpty(mobiles)){
			var error = '至少需要一个手机';
			that.$('[name="mobile[]"]').parent().addClass('has-error');
			that.$('[name="mobile[]"]').parent().find('span.help-block').text(error);
			return false;
		};
		this.model.set('mobile', mobiles);
		//** 订购行为
		this.model.set('action','order');
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});			
		return false;
	},

	cancel: function(){
		window.history.back();
		// this.router.navigate('promote/product/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.$el.html(this.successTemplate());
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		//** 当前产品的选择
		var effectMethod = this.product.get('effectMethod') || [];
		var html = '';
		var rightNow = '';
		var nextMonth = '';
		_.each(effectMethod, function(method){
			if(method == '立即生效'){
				rightNow = '<input type="radio" name="effectMethod" value="立即生效" checked>&nbsp;&nbsp;立即生效&nbsp;&nbsp;';
			}
			if(method == '次月生效'){
				nextMonth = '<input type="radio" name="effectMethod" value="次月生效">&nbsp;&nbsp;次月生效&nbsp;&nbsp;';
			}			
		});
		html = rightNow + nextMonth;
		this.$('#effectMethod').append(html);
		return this;
	},
});

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#productView',
	template: _.template($('#tpl-product-view').html()),

	initialize: function(options) {
		this.router = options.router;
		this.model = new Product({_id: options.id});
		this.model.on('change', this.change ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	change: function(){
		this.render();
		this.dataAddView = new OrderView({
			router: this.router,
			el: '#orderView',
			product: this.model,
		});
		this.dataAddView.on('ready',this.dataAddViewReady,this);
		this.dataAddView.trigger('load');
	},

	dataAddViewReady: function(){
		// var goods = this.model.get('goods');
		// this.$('form').prepend('<input type="hidden" name="product[id]" value="'+ this.model.get('_id') + '">');
		// this.$('form').prepend('<input type="hidden" name="product[name]" value="'+ this.model.get('subject') + '">');
		// this.$('form').prepend('<input type="hidden" name="product[category]" value="'+ this.model.get('category') + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[name]" value="'+ goods.name + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[nickname]" value="'+ goods.nickname + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[sourceId]" value="'+ goods.sourceId + '">');
	},

	back: function(){
		window.history.back();
		// this.router.navigate('data/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var thumbnail_url = this.model.get('thumbnail_url'); 
		this.$('img').attr('src', thumbnail_url);
		return this;
	},
});
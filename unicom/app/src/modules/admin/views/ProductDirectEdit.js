var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityProductDirect.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var ProductDirect = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/product/directs',	
	defaults: {
		goods: {},
		bonus: {
			income: 0,
			times: 1,
			points: 0,
		},
	},
	validation: {
	    'name': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'goods[name]': {
			required: true,
			msg: '请选择一个物料'
	    }
	},
});
exports = module.exports = FormView.extend({

	el: '#productForm',

	modelFilled: false,
	categories: [],//** 产品分类

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductDirect({_id: options.id});
		var page = $(productTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="goods[name]"]': 'getGoods',
		'click li.list-group-item': 'selectGoods',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		var that = this;
		$.ajax({
			url: config.api.host + '/public/product/categories',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		}).done(function(data) {
			that.categories = data;
			if(that.model.isNew()){
				that.modelFilled = true;
				that.fillCategoryOptions();
				return;
			}

			that.model.fetch({
				xhrFields: {
					withCredentials: true
				},
			});
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
	
	fillCategoryOptions: function(){
		var that = this;
		var optionsHtml = '<options>';
		_.each(that.categories,function(option){
			optionsHtml += '<option value="' + option.name + '">' +option.name + '</option>';
		});
		optionsHtml += '</options>';
		that.$('select[name=category]').html(optionsHtml);
	},

	getGoods: function(evt){
		this.$('#goods').empty();
		var that = this;
		var searchStr = this.$('input[name="goods[name]"]').val() || '';
		if(searchStr.length > 1){
			$.ajax({
				url: config.api.host + '/protect/goods?action=search&per=10&searchStr=' + searchStr,
				type: 'GET',
				fields: {
					withCredentials: true
				}
			}).done(function(data){
				data = data || [];
				var goods = '<ul class="list-group">';
				data.forEach(function(item){
					goods += '<li class="list-group-item" id="' +
							item._id + '" price="'+ 
							item.price + '" quantity="'+ 
							(item.quantity || '') +'">'+ 
							item.smscode + '|' +
							item.barcode + '|' + 
							item.name + 
							'</li>';
				});
				goods += '</ul>';
				that.$('#goods').html(goods);
			});
		}
		return false;
	},

	selectGoods: function(evt){
		var id= $(evt.currentTarget).attr('id');
		var price = $(evt.currentTarget).attr('price');
		var quantity = $(evt.currentTarget).attr('quantity');
		var goods = $(evt.currentTarget).text().split('|');
		this.$('input[name="goods[barcode]"]').val(goods[1]);
		this.$('input[name="goods[name]"]').val(goods[2]);
		this.$('input[name=name]').val(goods[2]);
		this.$('input[name="goods[id]"]').val(id);
		this.$('input[name=price]').val(price);
		this.$('input[name=quantity]').val(quantity);
		this.$('#goods').empty();
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('form-group').removeClass('has-error');
		this.$('form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(!_.isEmpty(error)){
				errors.push(error);
				//set serrors
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
				return false;
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
		this.router.navigate('product/direct/index',{trigger: true, replace: true});
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
			this.router.navigate('product/direct/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		//** 填充产品分类options
		this.fillCategoryOptions();
		//** 当前选择
		var category = this.model.get('category');
		this.$('select[name=category]').val(category);
		var starttime = this.model.get('starttime');
		this.$('input[name=starttime]').val(starttime);
		var endtime = this.model.get('endtime');
		this.$('input[name=endtime]').val(endtime);
		var status = this.model.get('status');
		if(status) this.$('input[name=status][value='+ status +']').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增产品');
		return this;
	},
});
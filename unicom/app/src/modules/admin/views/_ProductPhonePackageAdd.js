var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityProductPhone.tpl'),
	ProductPhonePackage = require('../models/ProductPhonePackage');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#packageForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductPhonePackage({_id: options.id});
		var page = $(productTpl);
		var addTemplate = $('#packageAddTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'click #addPackageToggle': 'toggleAddPackage',
		// 'click .packageAdd': 'packageAdd',
		'click .packageRemove': 'packageRemove',
		'keyup input[name="package[goods][name]"]': 'getGoods',
		'click li.list-group-item': 'selectGoods',
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
	
	toggleAddPackage: function(evt){
		this.$('#addPackageForm').toggle();
		return false;
	},

	getGoods: function(evt){
		this.$('#goods').empty();
		var that = this;
		var searchStr = this.$('input[name="package[goods][name]"]').val() || '';
		if(searchStr.length > 1){
			$.ajax({
				url: config.api.host + '/goods?type=search&per=10&searchStr=' + searchStr,
				type: 'GET',
				fields: {
					withCredentials: true
				}
			}).done(function(data){
				data = data || [];
				var goods = '<ul class="list-group">';
				data.forEach(function(item){
					goods += '<li class="list-group-item">'+ 
							item.foreigner + '|' + 
							item.name  + '|' + 
							item.category + '|' +
							item.price + item.unit + '|' +
							item.quantity + '</li>';
				});
				goods += '</ul>';
				that.$('#goods').html(goods);
			});
		}
		return false;
	},

	selectGoods: function(evt){
		var goods = $(evt.currentTarget).text().split('|');
		this.$('input[name="package[goods][id]"]').val(goods[0]);
		this.$('input[name="package[goods][name]"]').val(goods[1]);
		this.$('#goods').empty();
		return false;
	},


	// packageAdd: function(){
	// 	var that = this;
	// 	var category = that.$('input[name="category"]').val();
	// 	var description = that.$('textarea[name="description"]').val();
	// 	var goods_name = that.$('input[name="package[goods][name]"]').val();
	// 	var goods_id = that.$('input[name="package[goods][id]"]').val();
	// 	$.ajax({
	// 		url: config.api.host + '/product/phones/'+ this.model.get('_id') +'?type=addpackage',
	// 		type: 'PUT',
	// 		xhrFields: {
	// 			withCredentials: true
	// 		},
	// 		data: {
	// 			category: category,
	// 			description: description,
	// 			goods: {
	// 				id: goods_id,
	// 				name: goods_name
	// 			}
	// 		},
	// 	}).done(function(data){
	// 		var pkgs = data.packages || [];
	// 		that.$('#packages').empty();
	// 		//set phonePackage
	// 		_.each(pkgs, function(pkg){				
	// 			var newPackageView = '';
	// 			var id= pkg._id;
	// 			newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
	// 			newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-minus fa-lg"></i></button>';
	// 			newPackageView += '</div>';
	// 			newPackageView += '<div style="padding-left:60px;">';
	// 			newPackageView += '<h4>'+ pkg.category +'</h4>';
	// 			newPackageView += '<p>'+ pkg.description +'</p>';
	// 			newPackageView += '</div><hr/></div>';
	// 			that.$('#packages').prepend(newPackageView);
	// 		});		
	// 		that.$('#addPackageForm').hide();
	// 	}).fail(function(error){
	// 		that.$('#packages').prepend('没有成功！');
	// 	});
	// 	return false;
	// },

	packageRemove: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var that = this;
			var id = that.$(evt.currentTarget).parent().parent().attr('id');
			$.ajax({
				url: config.api.host + '/product/phones/'+ this.model.get('_id'),
				type: 'PUT',
				xhrFields: {
					withCredentials: true
				},
				data: {
					action: 'removepackage',
					id: id,
				},
			});
			that.$('#' + id).remove();
		}
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
		this.model.set('action','addpackage');
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	
	cancel: function(){
		this.router.navigate('product/phone/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//set phonePackage
			var pkgs = this.model.get('packages') || [];
			_.each(pkgs, function(pkg){
				var newPackageView = '';
				var id= pkg._id;
				var goods = pkg.goods || {};
				newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
				newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-minus fa-lg"></i></button>';
				newPackageView += '</div>';
				newPackageView += '<div style="padding-left:60px;">';
				newPackageView += '<h4>名称：'+ pkg.name +'</h4>';
				newPackageView += '<p>类型：'+ pkg.category +'</p>';
				newPackageView += '<p>描述：'+ pkg.description +'</p>';
				newPackageView += '<p>价格：'+ pkg.price + pkg.unit + '</p>';
				newPackageView += '<p>物料名称：'+ goods.name  +'</p>';
				newPackageView += '<p>物料编码：'+ goods.id +'</p>';
				newPackageView += '</div><hr/></div>';
				that.$('#packages').prepend(newPackageView);
			});		

		}else{
			//second fetch: submit
			var pkgs = response.packages || [];
			that.$('#packages').empty();
			//set phonePackage
			_.each(pkgs, function(pkg){				
				var newPackageView = '';
				var id= pkg._id;
				var goods = pkg.goods || {};
				newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
				newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-minus fa-lg"></i></button>';
				newPackageView += '</div>';
				newPackageView += '<div style="padding-left:60px;">';
				newPackageView += '<h4>名称：'+ pkg.name +'</h4>';
				newPackageView += '<p>类型：'+ pkg.category +'</p>';
				newPackageView += '<p>描述：'+ pkg.description +'</p>';
				newPackageView += '<p>价格：'+ pkg.price + pkg.unit + '</p>';
				newPackageView += '<p>物料名称：'+ goods.name  +'</p>';
				newPackageView += '<p>物料编码：'+ goods.id +'</p>';
				newPackageView += '</div><hr/></div>';
				that.$('#packages').prepend(newPackageView);
			});		
			that.$('#addPackageForm').hide();
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		this.$('#addPackageForm').hide();
		return this;
	},
});
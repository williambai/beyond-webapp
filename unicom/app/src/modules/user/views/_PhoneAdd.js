var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityPhone.tpl'),
	ProductPhone = require('../models/ProductPhone');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#orderForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductPhone({_id: options.id});
		var page = $(productTpl);
		var editTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .view': 'phoneView',
		'keyup input[type=text]': 'inputText',
		'change select[name="package[category]"]' : 'packageCategorySelected',
		'change select[name="package[months]"]': 'packageMonthsSelected',
		'change select[name="package[price]"]': 'packagePriceSelected',
		'click .packageAdd': 'packageAdd',
		'click .packageRemove': 'packageRemove',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			this.loadPhonePackage();
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	loadPhonePackage: function(cb){
		var that = this;
		$.ajax({
			url: config.api.host + '/dict/phone/packages?type=all',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data){
			data = data || [];
			that.packages = data;
			//1. initial category select
			var categoriesView = '';
			var categories = _.uniq(_.pluck(data, 'category'));
			_.each(categories,function(category){
				categoriesView += '<option value='+ category +'>' + category + '</option>';
			});
			that.$('select[name="package[category]"]').html(categoriesView);
			//2. initial months select
			var monthsView = '';
			var months = _.uniq(_.pluck(_.where(data,{category: categories[0]}),'months'));
			_.each(months,function(item){
				monthsView += '<option value='+ item +'>' + item + '</option>';
			});
			that.$('select[name="package[months]"]').html(monthsView);
			//3. initial price select
			var priceView = '';
			var prices = _.uniq(_.pluck(_.where(data,{category: categories[0], months: months[0]}),'price'));
			_.each(prices,function(item,i){
				priceView += '<option value='+ item +'>' + item + '</option>';
			});
			that.$('select[name="package[price]"]').html(priceView);
			//4. initial name select
			var nameView = '';
			var names = _.uniq(_.pluck(_.where(data,{category: categories[0], months: months[0], price: prices[0]}),'name'));
			_.each(names,function(item){
				nameView += '<option value='+ item +'>' + item + '</option>';
			});
			that.$('select[name="package[name]"]').html(nameView);
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

	phoneView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('phone/view/'+ id,{trigger: true});
		return false;
	},

	packageCategorySelected: function(evt){
		var that = this;
		var data = this.packages;
		var category = this.$(evt.currentTarget).val();
		//1. initial category select
		// var categoriesView = '';
		// var categories = _.uniq(_.pluck(data, 'category'));
		// _.each(categories,function(category){
		// 	categoriesView += '<option value='+ category +'>' + category + '</option>';
		// });
		// that.$('select[name="package[category]"]').html(categoriesView);
		//2. initial months select
		var monthsView = '';
		var months = _.uniq(_.pluck(_.where(data,{category: category}),'months'));
		_.each(months,function(item){
			monthsView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[months]"]').html(monthsView);
		//3. initial price select
		var priceView = '';
		var prices = _.uniq(_.pluck(_.where(data,{category: category, months: months[0]}),'price'));
		_.each(prices,function(item,i){
			priceView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[price]"]').html(priceView);
		//4. initial name select
		var nameView = '';
		var names = _.uniq(_.pluck(_.where(data,{category: category, months: months[0], price: prices[0]}),'name'));
		_.each(names,function(item){
			nameView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[name]"]').html(nameView);
		return false;
	},

	packageMonthsSelected: function(evt){
		var that = this;
		var data = this.packages;
		var category = this.$('select[name="package[category]"]').val();
		var months = this.$(evt.currentTarget).val();
		//1. initial category select
		// var categoriesView = '';
		// var categories = _.uniq(_.pluck(data, 'category'));
		// _.each(categories,function(category){
		// 	categoriesView += '<option value='+ category +'>' + category + '</option>';
		// });
		// that.$('select[name="package[category]"]').html(categoriesView);
		//2. initial months select
		// var monthsView = '';
		// var months = _.uniq(_.pluck(_.where(data,{category: category}),'months'));
		// _.each(months,function(item){
		// 	monthsView += '<option value='+ item +'>' + item + '</option>';
		// });
		// that.$('select[name="package[months]"]').html(monthsView);
		//3. initial price and name select
		var priceView = '';
		var prices = _.uniq(_.pluck(_.where(data,{category: category, months: months}),'price'));
		_.each(prices,function(item,i){
			priceView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[price]"]').html(priceView);
		//4. initial name select
		var nameView = '';
		var names = _.uniq(_.pluck(_.where(data,{category: category, months: months, price: prices[0]}),'name'));
		_.each(names,function(item){
			nameView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[name]"]').html(nameView);
		return false;
	},

	packagePriceSelected: function(evt){
		var that = this;
		var data = this.packages;
		var category = this.$('select[name="package[category]"]').val();
		var months = this.$('select[name="package[months]"]').val();
		var price = this.$(evt.currentTarget).val();
		//1. initial category select
		// var categoriesView = '';
		// var categories = _.uniq(_.pluck(data, 'category'));
		// _.each(categories,function(category){
		// 	categoriesView += '<option value='+ category +'>' + category + '</option>';
		// });
		// that.$('select[name="package[category]"]').html(categoriesView);
		//2. initial months select
		// var monthsView = '';
		// var months = _.uniq(_.pluck(_.where(data,{category: category}),'months'));
		// _.each(months,function(item){
		// 	monthsView += '<option value='+ item +'>' + item + '</option>';
		// });
		// that.$('select[name="package[months]"]').html(monthsView);
		//3. initial price and name select
		var priceView = '';
		var prices = _.uniq(_.pluck(_.where(data,{category: category, months: months}),'price'));
		_.each(prices,function(item,i){
			priceView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[price]"]').html(priceView);
		//4. initial name select
		var nameView = '';
		var names = _.uniq(_.pluck(_.where(data,{category: category, months: months, price: price}),'name'));
		_.each(names,function(item){
			nameView += '<option value='+ item +'>' + item + '</option>';
		});
		that.$('select[name="package[name]"]').html(nameView);
		return false;
	},

	packageAdded: {},
	packageAdd: function(){
		var that = this;
		var packageName = that.$('select[name="package[name]"]').val();
		var pkg = _.findWhere(that.packages,{name: packageName});
		var newPackageView = '';
		var id= pkg._id;
		newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
		newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-minus fa-lg"></i></button>';
		newPackageView += '</div>';
		newPackageView += '<div style="padding-left:60px;">';
		newPackageView += '<h4>'+ pkg.name +'</h4>';
		newPackageView += '<p>'+ pkg.price.toFixed(2) +'元</p>';
		newPackageView += '</div><hr/></div>';
		that.$('#packages').append(newPackageView);
		that.packageAdded[id] = pkg;
		return false;
	},

	packageRemove: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var that = this;
			var id = that.$(evt.currentTarget).parent().parent().attr('id');
			console.log(id)
			that.$('#' + id).remove();
			that.packageAdded = _.omit(that.packageAdded,id);
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
		var packageIds = _.uniq(this.model.get('packages'));
		var packages = [];
		_.each(packageIds,function(id){
			var pkg = _.findWhere(that.packages,{_id:id});
			if(pkg){
				packages.push(pkg);
			}
		});
		this.model.set('packages', packages);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	
	cancel: function(){
		this.router.navigate('phone/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//load phonePackage select
			this.loadPhonePackage();
			//set phonePackage
			var pkgs = this.model.get('packages') || [];
			_.each(pkgs, function(pkg){
				var newPackageView = '';
				var id= pkg._id;
				newPackageView += '<div id="'+ id +'"><input type="hidden" name="packages[]" value="'+ id +'"><div class="pull-left">';
				newPackageView += '<button class="btn btn-danger packageRemove"><i class="fa fa-minus fa-lg"></i></button>';
				newPackageView += '</div>';
				newPackageView += '<div style="padding-left:60px;">';
				newPackageView += '<h4>'+ pkg.name +'</h4>';
				newPackageView += '<p>'+ pkg.price.toFixed(2) +'元</p>';
				newPackageView += '</div><hr/></div>';
				that.$('#packages').append(newPackageView);
				that.packageAdded[id] = pkg;
			});		
		}else{
			//second fetch: submit
			this.router.navigate('phone/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('#panel-title').text('推荐终端');
		//set image
		var thumbnail_url = this.model.get('thumbnail_url');
		if(thumbnail_url) that.$('img#thumbnail_url').attr('src',thumbnail_url);
		return this;
	},
});
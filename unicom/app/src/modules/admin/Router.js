var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('../../views/_Login2');
var WeChatLoginView = require('../../views/_WeChatLogin');
var MyAccountViewView = require('../../views/_MyAccountView');
var MyAccountEditView = require('../../views/_MyAccountEdit');
var FeedbackIndexView = require('../../views/_FeedbackIndex');
var FeedbackEditView = require('../../views/_FeedbackEdit');

var IndexView = require('./views/Index');

var AccountIndexView = require('./views/AccountIndex');
var AccountEditView = require('./views/AccountEdit');
var ProductCategoryIndexView = require('./views/ProductCategoryIndex');
var ProductCategoryEditView = require('./views/ProductCategoryEdit');
var ProductDirectIndexView = require('./views/ProductDirectIndex');
var ProductDirectEditView = require('./views/ProductDirectEdit');
var GoodsIndexView = require('./views/GoodsIndex');
var GoodsEditView = require('./views/GoodsEdit');
var GoodsImportView = require('./views/GoodsImport');
var GoodsExportView = require('./views/GoodsExport');
var BonusIndexView = require('./views/BonusIndex');
var BonusEditView = require('./views/BonusEdit');
var OrderIndexView = require('./views/OrderIndex');
// var OrderViewView = require('./views/_OrderView');
var OrderEditView = require('./views/OrderEdit');
var OrderExportView = require('./views/OrderExport');
var CarouselIndexView = require('./views/CarouselIndex');
var CarouselEditView = require('./views/CarouselEdit');

var MediaIndexView = require('./views/_MediaIndex');
var MediaEditView = require('./views/_MediaEdit');
var MediaAddView = require('./views/_MediaAdd');


var PageStaticIndexView = require('./views/_PageStaticIndex');
var PageStaticEditView = require('./views/_PageStaticEdit');
var PageDynamicIndexView = require('./views/_PageDynamicIndex');
var PageDynamicEditView = require('./views/_PageDynamicEdit');
var PageDynamicViewView = require('./views/_PageDynamicView');


// var ProductExchangeIndexView = require('./views/_ProductExchangeIndex');
// var ProductExchangeEditView = require('./views/_ProductExchangeEdit');


var ProductPhoneIndexView = require('./views/_ProductPhoneIndex');
var ProductPhoneEditView = require('./views/_ProductPhoneEdit');
var ProductPhonePackageIndexView = require('./views/_ProductPhonePackageIndex');
var ProductPhonePackageEditView = require('./views/_ProductPhonePackageEdit');

var ProductCardPackageIndexView = require('./views/_ProductCardPackageIndex');
var ProductCardPackageEditView = require('./views/_ProductCardPackageEdit');

var ProductCardIndexView = require('./views/_ProductCardIndex');
var ProductCardEditView = require('./views/_ProductCardEdit');
var ProductCardImportView = require('./views/_ProductCardImport');
var ProductCardExportView = require('./views/_ProductCardExport');

var ChannelIndexView = require('./views/_ChannelIndex');
var ChannelEditView = require('./views/_ChannelEdit');

var CustomerIndexView = require('./views/_CustomerIndex');
var CustomerEditView = require('./views/_CustomerEdit');
var CustomerImportView = require('./views/_CustomerImport');
var CustomerExportView = require('./views/_CustomerExport');

var RevenueIndexView = require('./views/_RevenueIndex');
var RevenueEditView = require('./views/_RevenueEdit');

var RoleIndexView = require('./views/_RoleIndex');
var RoleEditView = require('./views/_RoleEdit');

var ChannelCategoryIndexView = require('./views/_ChannelCategoryIndex');
var ChannelCategoryAddView = require('./views/_ChannelCategoryAdd');
var ChannelCategoryEditView = require('./views/_ChannelCategoryEdit');

var DepartmentIndexView = require('./views/_DepartmentIndex');
var DepartmentEditView = require('./views/_DepartmentEdit');
var DepartmentImportView = require('./views/_DepartmentImport');
var DepartmentExportView = require('./views/_DepartmentExport');

//** Deprecated
// var GridIndexView = require('./views/_GridIndex');
// var GridEditView = require('./views/_GridEdit');

// var OrderCardIndexView = require('./views/_OrderCardIndex');
// var OrderCardAddView = require('./views/_OrderCardAdd');
// var OrderCardEditView = require('./views/_OrderCardEdit');
// var OrderCardViewView = require('./views/_OrderCardView');

exports = module.exports = Backbone.Router.extend({
	appCode: config.app.nickname,

	account: null,//login account
	features: [],
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'wechat/login': 'wechatLogin',
		'logout': 'logout',
		'profile/:id': 'profileView',
		'profile/edit/me': 'profileEdit',
		'feedback/index': 'feedbackIndex',
		'feedback/index': 'feedbackIndex',
		'feedback/add': 'feedbackEdit',

		'account/index': 'accountIndex',
		'account/add': 'accountEdit',
		'account/edit/:id': 'accountEdit',

		'bonus/index': 'bonusIndex',
		'bonus/add': 'bonusEdit',
		'bonus/edit/:id': 'bonusEdit',

		'customer/index': 'customerIndex',
		'customer/add': 'customerEdit',
		'customer/edit/:id': 'customerEdit',
		'customer/import': 'customerImport',
		'customer/export': 'customerExport',

		'goods/index': 'goodsIndex',
		'goods/add': 'goodsEdit',
		'goods/edit/:id': 'goodsEdit',
		'goods/import': 'goodsImport',
		'goods/export': 'goodsExport',

		'media/index': 'mediaIndex',
		'media/add': 'mediaAdd',
		'media/edit/:id': 'mediaEdit',
		'page/static/index': 'pageStaticIndex',
		'page/static/add': 'pageStaticEdit',
		'page/static/edit/:id': 'pageStaticEdit',
		'page/dynamic/index': 'pageDynamicIndex',
		'page/dynamic/add': 'pageDynamicEdit',
		'page/dynamic/edit/:id': 'pageDynamicEdit',
		'page/dynamic/view/:id': 'pageDynamicView',
		'carousel/index': 'carouselIndex',
		'carousel/add': 'carouselEdit',
		'carousel/edit/:id': 'carouselEdit',

		'product/category/index': 'productCategoryIndex',
		'product/category/add': 'productCategoryEdit',
		'product/category/edit/:id': 'productCategoryEdit',

		'product/direct/index': 'productDirectIndex',
		'product/direct/add': 'productDirectEdit',
		'product/direct/edit/:id': 'productDirectEdit',

		'product/exchange/index': 'productExchangeIndex',
		'product/exchange/add': 'productExchangeEdit',
		'product/exchange/edit/:id': 'productExchangeEdit',


		'product/phone/index': 'productPhoneIndex',
		'product/phone/add': 'productPhoneEdit',
		'product/phone/edit/:id': 'productPhoneEdit',
		'product/phone/:pid/package/index': 'productPhonePackageIndex',
		'product/phone/:pid/package/add': 'productPhonePackageEdit',
		'product/phone/:pid/package/edit/:id': 'productPhonePackageEdit',

		'product/card/index': 'productCardIndex',
		'product/card/add': 'productCardEdit',
		'product/card/edit/:id': 'productCardEdit',
		'product/card/import': 'productCardImport',
		'product/card/export': 'productCardExport',
		'product/card/package/index': 'productCardPackageIndex',
		'product/card/package/add': 'productCardPackageEdit',
		'product/card/package/edit/:id': 'productCardPackageEdit',

		'order/index': 'orderIndex',
		'order/view/:id': 'orderView',
		'order/edit/:id': 'orderEdit',
		'order/export': 'orderExport',

		'role/index': 'roleIndex',
		'role/add': 'roleEdit',
		'role/edit/:id': 'roleEdit',

		'channel/index': 'channelIndex',
		'channel/add': 'channelEdit',
		'channel/edit/:id': 'channelEdit',

		'channel/category/index': 'channelCategoryIndex',
		'channel/category/add': 'channelCategoryEdit',
		'channel/category/edit/:id': 'channelCategoryEdit',

		'department/index': 'departmentIndex',
		'department/add': 'departmentEdit',
		'department/edit/:id': 'departmentEdit',
		'department/import': 'departmentImport',
		'department/export': 'departmentExport',

		'revenue/index': 'revenueIndex',
		'revenue/add': 'revenueEdit',
		'revenue/view/:id': 'revenueView',
		'revenue/edit/:id': 'revenueEdit',

		// 'grid/index': 'gridIndex',
		// 'grid/add': 'gridEdit',
		// 'grid/edit/:id': 'gridEdit',		
		// 'order/card/index': 'orderCardIndex',
		// 'order/card/add': 'orderCardAdd',
		// 'order/card/view/:id': 'orderCardView',
		// 'order/card/edit/:id': 'orderCardEdit',

		'*path': 'index',
	},

	initialize: function(){
		this.appEvents.on('logined',this.onLogined,this);
		this.appEvents.on('logout', this.onLogout,this);
		this.layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		this.layoutView.trigger('load');
	},

	onLogined: function(account) {
		var that = this;
		this.account = account;
		this.logined = true;
		/** default menu */
		// this.layoutView.trigger('update:menu', _.sortBy(_.flatten(_.values(config.menu)), 'id'));
		// return;
		/** -OR- customize menu */
		var menu_default = config.menu || [];
		var features = _.keys(that.account.grant);
		// console.log(features);
		var menu_granted = [];
		_.each(menu_default,function(menu){
			if(_.isEmpty(menu.features)) return menu_granted.push(menu);
			var menu_features = menu.features || [];
			var intersection = _.intersection(features,menu_features);
			if(!_.isEmpty(intersection)) menu_granted.push(menu);
		});
		that.layoutView.trigger('update:menu', menu_granted);
	},

	onLogout: function(){
		this.logined = false;
		window.location.reload();
	},

	changeView: function(view){
		if(null != this.currentView){
			this.currentView.undelegateEvents();
		}
		this.currentView = view;
		$('body').removeClass('has-navbar-bottom');
		$('.bottom-bar').remove();
		this.currentView.render();
	},

	index: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','首页');
		var indexView = new IndexView({
		});
		this.changeView(indexView);
		indexView.trigger('load');
	},	
	login: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','登录');
		var loginView = new LoginView({
			appCode: this.appCode,
			router: this,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},

	wechatLogin: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand', '登录');
		var loginView = new WeChatLoginView({
			router: this,
			appCode: this.appCode,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},

	logout: function(){
		this.logined = false;
		window.location.hash = 'login';
		$.ajax({
			url: config.api.host + '/admin/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
	},

	profileView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '个人资料');
		if (id == this.account.id) {
			id = 'me';
		}
		var profileViewView = new MyAccountViewView({
			router: this,
			el: '#content',
			id: id,
			appEvents: this.appEvents,
		});
		this.changeView(profileViewView);
		profileViewView.trigger('load');
	},


	profileEdit: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '编辑个人资料');
		var profileEditView = new MyAccountEditView({
			router: this,
			el: '#content',
			id: 'me',
		});
		this.changeView(profileEditView);
		profileEditView.trigger('load');
	},

	feedbackIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','意见反馈');
		var feedbackIndexView = new FeedbackIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(feedbackIndexView);
		feedbackIndexView.trigger('load');
	},	

	feedbackEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','意见反馈');
		var feedbackEditView = new FeedbackEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(feedbackEditView);
		feedbackEditView.trigger('load');
	},	

	accountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','账号管理');
		var accountIndexView = new AccountIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(accountIndexView);
		accountIndexView.trigger('load');
	},	

	accountEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改账号');
		var accountEditView = new AccountEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(accountEditView);
		accountEditView.trigger('load');
	},	

	bonusIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','佣金管理');
		var bonusIndexView = new BonusIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(bonusIndexView);
		bonusIndexView.trigger('load');
	},	

	bonusEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','发放佣金');
		var bonusEditView = new BonusEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(bonusEditView);
		bonusEditView.trigger('load');
	},	

	channelIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','渠道管理');
		var channelIndexView = new ChannelIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(channelIndexView);
		channelIndexView.trigger('load');
	},	

	channelEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改渠道');
		var channelEditView = new ChannelEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(channelEditView);
		channelEditView.trigger('load');
	},	

	customerIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','客户管理');
		var customerIndexView = new CustomerIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(customerIndexView);
		customerIndexView.trigger('load');
	},	

	customerEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改客户');
		var customerEditView = new CustomerEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(customerEditView);
		customerEditView.trigger('load');
	},	

	customerImport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','客户导入');
		var customerImportView = new CustomerImportView({
			router: this,
			el: '#content',
		});
		this.changeView(customerImportView);
		customerImportView.trigger('load');
	},	

	customerExport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','客户导出');
		var customerExportView = new CustomerExportView({
			router: this,
			el: '#content',
		});
		this.changeView(customerExportView);
		customerExportView.trigger('load');
	},	

	goodsIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','物料管理');
		var goodsIndexView = new GoodsIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(goodsIndexView);
		goodsIndexView.trigger('load');
	},	

	goodsEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改物料');
		var goodsEditView = new GoodsEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(goodsEditView);
		goodsEditView.trigger('load');
	},	

	goodsImport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','物料导入');
		var goodsImportView = new GoodsImportView({
			router: this,
			el: '#content',
		});
		this.changeView(goodsImportView);
		goodsImportView.trigger('load');
	},	

	goodsExport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','物料导出');
		var goodsExportView = new GoodsExportView({
			router: this,
			el: '#content',
		});
		this.changeView(goodsExportView);
		goodsExportView.trigger('load');
	},	

	mediaIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','媒体文件管理');
		var mediaIndexView = new MediaIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(mediaIndexView);
		mediaIndexView.trigger('load');
	},	

	mediaAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增媒体文件');
		var mediaAddView = new MediaAddView({
			router: this,
			el: '#content',
		});
		this.changeView(mediaAddView);
		mediaAddView.trigger('load');
	},	

	mediaEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改媒体文件');
		var mediaEditView = new MediaEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(mediaEditView);
		mediaEditView.trigger('load');
	},	

	pageStaticIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','网页管理');
		var pageStaticIndexView = new PageStaticIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(pageStaticIndexView);
		pageStaticIndexView.trigger('load');
	},	

	pageStaticEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改网页');
		var pageStaticEditView = new PageStaticEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(pageStaticEditView);
		pageStaticEditView.trigger('load');
	},	


	pageDynamicIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','模板管理');
		var pageDynamicIndexView = new PageDynamicIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(pageDynamicIndexView);
		pageDynamicIndexView.trigger('load');
	},	

	pageDynamicEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改模板');
		var pageDynamicEditView = new PageDynamicEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(pageDynamicEditView);
		pageDynamicEditView.trigger('load');
	},	

	pageDynamicView: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','查看模板');
		var pageDynamicViewView = new PageDynamicViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(pageDynamicViewView);
		pageDynamicViewView.trigger('load');
	},	

	carouselIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','轮播管理');
		var carouselIndexView = new CarouselIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(carouselIndexView);
		carouselIndexView.trigger('load');
	},	

	carouselEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改轮播');
		var carouselEditView = new CarouselEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(carouselEditView);
		carouselEditView.trigger('load');
	},	

	productDirectIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','直通产品管理');
		var productDirectIndexView = new ProductDirectIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(productDirectIndexView);
		productDirectIndexView.trigger('load');
	},	

	productDirectEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改直通产品');
		var productDirectEditView = new ProductDirectEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productDirectEditView);
		productDirectEditView.trigger('load');
	},		


	productCategoryIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','产品分类管理');
		var productCategoryIndexView = new ProductCategoryIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(productCategoryIndexView);
		productCategoryIndexView.trigger('load');
	},	

	productCategoryEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改产品分类');
		var productCategoryEditView = new ProductCategoryEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productCategoryEditView);
		productCategoryEditView.trigger('load');
	},		



	productExchangeIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','兑换商品管理');
		var productExchangeIndexView = new ProductExchangeIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(productExchangeIndexView);
		productExchangeIndexView.trigger('load');
	},	

	productExchangeEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改兑换商品');
		var productExchangeEditView = new ProductExchangeEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productExchangeEditView);
		productExchangeEditView.trigger('load');
	},		

	productPhonePackageIndex: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','终端套餐设置');
		var productPhonePackageIndexView = new ProductPhonePackageIndexView({
			router: this,
			el: '#content',
			pid: pid,
		});
		this.changeView(productPhonePackageIndexView);
		productPhonePackageIndexView.trigger('load');
	},	

	productPhonePackageEdit: function(pid,id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改终端套餐');
		var productPhonePackageEditView = new ProductPhonePackageEditView({
			router: this,
			el: '#content',
			pid: pid,
			id: id,
		});
		this.changeView(productPhonePackageEditView);
		productPhonePackageEditView.trigger('load');
	},		

	productPhoneIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','终端产品管理');
		var productPhoneIndexView = new ProductPhoneIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(productPhoneIndexView);
		productPhoneIndexView.trigger('load');
	},	

	productPhoneEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改终端产品');
		var productPhoneEditView = new ProductPhoneEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productPhoneEditView);
		productPhoneEditView.trigger('load');
	},		

	productCardPackageIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','号卡产品管理');
		var productCardPackageIndexView = new ProductCardPackageIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(productCardPackageIndexView);
		productCardPackageIndexView.trigger('load');
	},	

	productCardPackageEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改号卡产品');
		var productCardPackageEditView = new ProductCardPackageEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productCardPackageEditView);
		productCardPackageEditView.trigger('load');
	},		

	productCardIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','卡号管理');
		var cardIndexView = new ProductCardIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(cardIndexView);
		cardIndexView.trigger('load');
	},	

	productCardEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改卡号');
		var cardEditView = new ProductCardEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(cardEditView);
		cardEditView.trigger('load');
	},

	productCardImport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','卡号导入');
		var cardImportView = new ProductCardImportView({
			router: this,
			el: '#content',
		});
		this.changeView(cardImportView);
		cardImportView.trigger('load');
	},	


	productCardExport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','卡号导出');
		var cardExportView = new ProductCardExportView({
			router: this,
			el: '#content',
		});
		this.changeView(cardExportView);
		cardExportView.trigger('load');
	},	

	orderIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','订单管理');
		var orderIndexView = new OrderIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(orderIndexView);
		orderIndexView.trigger('load');
	},	

	orderEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改卡号订单');
		var orderEditView = new OrderEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(orderEditView);
		orderEditView.trigger('load');
	},				

	orderView: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','查看订单');
		var orderViewView = new OrderViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(orderViewView);
		orderViewView.trigger('load');
	},	


	orderExport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','导出订单');
		var orderExportView = new OrderExportView({
			router: this,
			el: '#content',
		});
		this.changeView(orderExportView);
		orderExportView.trigger('load');
	},	

	revenueIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','金币管理');
		var revenueIndexView = new RevenueIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(revenueIndexView);
		revenueIndexView.trigger('load');
	},	

	revenueEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改金币');
		var revenueEditView = new RevenueEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(revenueEditView);
		revenueEditView.trigger('load');
	},				

	roleIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','角色管理');
		var roleIndexView = new RoleIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(roleIndexView);
		roleIndexView.trigger('load');
	},

	roleEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改角色');
		var roleEditView = new RoleEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(roleEditView);
		roleEditView.trigger('load');
	},

	channelCategoryIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','渠道功能设置');
		var channelCategoryIndexView = new ChannelCategoryIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(channelCategoryIndexView);
		channelCategoryIndexView.trigger('load');
	},

	channelCategoryAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增渠道类型');
		var channelCategoryAddView = new ChannelCategoryAddView({
			router: this,
			el: '#content',
		});
		this.changeView(channelCategoryAddView);
		channelCategoryAddView.trigger('load');
	},

	channelCategoryEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改渠道类型');
		var channelCategoryEditView = new ChannelCategoryEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(channelCategoryEditView);
		channelCategoryEditView.trigger('load');
	},

	departmentIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','组织设置');
		var departmentIndexView = new DepartmentIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(departmentIndexView);
		departmentIndexView.trigger('load');
	},

	departmentEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改组织');
		var departmentEditView = new DepartmentEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(departmentEditView);
		departmentEditView.trigger('load');
	},	

	departmentImport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','客户导入');
		var departmentImportView = new DepartmentImportView({
			router: this,
			el: '#content',
		});
		this.changeView(departmentImportView);
		departmentImportView.trigger('load');
	},	

	departmentExport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','客户导出');
		var departmentExportView = new DepartmentExportView({
			router: this,
			el: '#content',
		});
		this.changeView(departmentExportView);
		departmentExportView.trigger('load');
	},	

	// gridIndex: function(){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','网格设置');
	// 	var gridIndexView = new GridIndexView({
	// 		router: this,
	// 		el: '#content',
	// 	});
	// 	this.changeView(gridIndexView);
	// 	gridIndexView.trigger('load');
	// },

	// gridEdit: function(id){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','修改网格');
	// 	var gridEditView = new GridEditView({
	// 		router: this,
	// 		el: '#content',
	// 		id: id,
	// 	});
	// 	this.changeView(gridEditView);
	// 	gridEditView.trigger('load');
	// },

	// orderCardIndex: function(){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','卡号订单管理');
	// 	var orderCardIndexView = new OrderCardIndexView({
	// 		router: this,
	// 		el: '#content',
	// 	});
	// 	this.changeView(orderCardIndexView);
	// 	orderCardIndexView.trigger('load');
	// },	

	// orderCardAdd: function(){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','新增卡号订单');
	// 	var orderCardAddView = new OrderCardAddView({
	// 		router: this,
	// 		el: '#content',
	// 	});
	// 	this.changeView(orderCardAddView);
	// 	orderCardAddView.trigger('load');
	// },	

	// orderCardEdit: function(id){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','修改卡号订单');
	// 	var orderCardEditView = new OrderCardEditView({
	// 		router: this,
	// 		el: '#content',
	// 		id: id,
	// 	});
	// 	this.changeView(orderCardEditView);
	// 	orderCardEditView.trigger('load');
	// },				

	// orderCardView: function(id){
	// 	if(!this.logined){
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand','查看卡号订单');
	// 	var orderCardViewView = new OrderCardViewView({
	// 		router: this,
	// 		el: '#content',
	// 		id: id,
	// 	});
	// 	this.changeView(orderCardViewView);
	// 	orderCardViewView.trigger('load');
	// },	

});
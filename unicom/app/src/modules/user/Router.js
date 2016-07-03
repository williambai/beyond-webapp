var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var RegisterView = require('../../views/_Register');
var ForgotPasswordView = require('../../views/_ForgotPassword');
var LoginView = require('../../views/_Login');
var WeChatLoginView = require('../../views/_WeChatLogin');
var MyAccountViewView = require('../../views/_MyAccountView');
var MyAccountEditView = require('../../views/_MyAccountEdit');
var FeedbackIndexView = require('../../views/_FeedbackIndex');
var FeedbackEditView = require('../../views/_FeedbackEdit');

var IndexView = require('./views/Index');
var ActivityIndexView = require('./views/ActivityIndex');
var PhoneIndexView = require('./views/PhoneIndex');

var HelpIndexView = require('./views/HelpIndex');
var MeIndexView = require('./views/MeIndex');
var MeChangePassView = require('./views/MeChangePass');
var MeBankView = require('./views/MeBank');
var MeBonusView = require('./views/MeBonus');
var MeBonusOrderView = require('./views/MeBonusOrder');
var RankTeamView = require('./views/RankTeam');
var RankPersonView = require('./views/RankPerson');
var CategoryIndexView = require('./views/CategoryIndex');
var CategoryProductView = require('./views/CategoryProducts');
var ProductHotsView = require('./views/ProductHots');
var ProductOrderView = require('./views/ProductOrder');
var ProductRecommendView = require('./views/ProductRecommend');
var OrderIndexView = require('./views/OrderIndex');
var CustomerIndexView = require('./views/CustomerIndex');
var SaleLeadIndexView = require('./views/SaleLeadIndex');
var SaleLeadEditView = require('./views/SaleLeadEdit');

exports = module.exports = Backbone.Router.extend({

	appCode: config.app.nickname,
	account: null, //login account
	logined: false,
	currentView: null,
	appEvents: _.extend({}, Backbone.Events), //app events

	routes: {
		'index': 'index',
		'login': 'login',
		'wechat/login': 'wechatLogin',
		'logout': 'logout',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'profile/:id': 'profileView',
		'profile/edit/me': 'profileEdit',
		'feedback/index': 'feedbackIndex',
		'feedback/add': 'feedbackEdit',
		'help/index': 'helpIndex',
		'me/index': 'meIndex',
		'me/changepass': 'meChangePass',
		'me/bank': 'meBank',
		'me/bonus': 'meBonus',
		'me/bonus/:id': 'meBonusOrder',
		'me/order': 'orderIndex',
		'rank/person': 'rankPerson',
		'rank/team': 'rankTeam',

		'category/index': 'categoryIndex',//** 产品分类
		'category/:cid/products': 'categoryProduct',//** 按分类查找产品
		'product/hots': 'productHot',//** 热门产品
		'product/order/:id': 'productOrder',//** 产品订购
		'product/recommend/:id': 'productRecommend',//** 产品推荐

		'activity/index': 'activityIndex',
		'phone/index': 'phoneIndex',
		'order/index': 'orderIndex',
		'customer/index': 'customerIndex',

		'sale/lead/index': 'saleLeadIndex',
		'sale/lead/edit/:id': 'saleLeadEdit',

		'*path': 'index',
	},

	initialize: function() {
		this.appEvents.on('logined', this.onLogined, this);
		this.appEvents.on('logout', this.onLogout, this);
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

	onLogout: function() {
		this.logined = false;
		window.location.reload();
	},

	changeView: function(view) {
		if (null != this.currentView) {
			this.currentView.undelegateEvents();
		}
		this.currentView = view;
		$('body').removeClass('has-navbar-bottom');
		$('.bottom-bar').remove();
		this.currentView.render();
	},

	index: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		// this.appEvents.trigger('set:brand', '贵州联通沃助手');
		var indexView = new IndexView({
			router: this,
		});
		this.changeView(indexView);
		indexView.trigger('load');
	},

	register: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand','注册');
		var registerView = new RegisterView({
			router: this,
			appCode: this.appCode,
			el: '#content'
		});
		this.changeView(registerView);
		registerView.trigger('load');
	},

	forgotPassword: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand','找回密码');
		var forgotPassword = new ForgotPasswordView({
			router: this,
			el: '#content'
		});
		this.changeView(forgotPassword);
		forgotPassword.trigger('load');
	},

	login: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand', '登录');
		var loginView = new LoginView({
			router: this,
			appCode: this.appCode,
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
		//this.appEvents.trigger('set:brand', '微信登录');
		var loginView = new WeChatLoginView({
			router: this,
			appCode: this.appCode,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},

	logout: function() {
		this.logined = false;
		window.location.hash = 'login';
		$.ajax({
			url: config.api.host + '/logout',
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
		//this.appEvents.trigger('set:brand', '个人资料');
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
		//this.appEvents.trigger('set:brand', '编辑个人资料');
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
		//this.appEvents.trigger('set:brand','意见反馈');
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
		//this.appEvents.trigger('set:brand','反映问题');
		var feedbackEditView = new FeedbackEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(feedbackEditView);
		feedbackEditView.trigger('load');
	},	

	helpIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','帮助中心');
		var helpIndexView = new HelpIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(helpIndexView);
		helpIndexView.trigger('load');
	},	

	meIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','个人中心');
		var meIndexView = new MeIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(meIndexView);
		meIndexView.trigger('load');
	},	

	meChangePass: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','修改密码');
		var meChangePassView = new MeChangePassView({
			router: this,
			el: '#content',
		});
		this.changeView(meChangePassView);
		meChangePassView.trigger('load');
	},	

	meBank: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','银行卡');
		var meBankView = new MeBankView({
			router: this,
			el: '#content',
		});
		this.changeView(meBankView);
		meBankView.trigger('load');
	},	

	meBonus: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','我的佣金');
		var meBonusView = new MeBonusView({
			router: this,
			el: '#content',
		});
		this.changeView(meBonusView);
		meBonusView.trigger('load');
	},	

	meBonusOrder: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','佣金明细');
		var meBonusOrderView = new MeBonusOrderView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(meBonusOrderView);
		meBonusOrderView.trigger('load');
	},	


	rankPerson: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','个人排行榜');
		var rankPersonView = new RankPersonView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(rankPersonView);
		rankPersonView.trigger('load');
	},	


	rankTeam: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','营业厅排行榜');
		var rankTeamView = new RankTeamView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(rankTeamView);
		rankTeamView.trigger('load');
	},	

	categoryIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品目录');
		var categoryIndexView = new CategoryIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(categoryIndexView);
		categoryIndexView.trigger('load');
	},


	categoryProduct: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '全部产品');
		var categoryProductView = new CategoryProductView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(categoryProductView);
		categoryProductView.trigger('load');
	},

	productHot: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '热门产品');
		var productHotView = new ProductHotsView({
			router: this,
			el: '#content',
		});
		this.changeView(productHotView);
		productHotView.trigger('load');
	},

	productOrder: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品订购');
		var productOrderView = new ProductOrderView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productOrderView);
		productOrderView.trigger('load');
	},

	productRecommend: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品推荐');
		var productRecommendView = new ProductRecommendView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productRecommendView);
		productRecommendView.trigger('load');
	},

	orderIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的成绩');
		var orderIndexView = new OrderIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(orderIndexView);
		orderIndexView.trigger('load');
	},

	customerIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的客户');
		var customerIndexView = new CustomerIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(customerIndexView);
		customerIndexView.trigger('load');
	},

	saleLeadIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '销售线索');
		var saleLeadIndexView = new SaleLeadIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(saleLeadIndexView);
		saleLeadIndexView.trigger('load');
	},

	saleLeadEdit: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '销售线索处理');
		var saleLeadEditView = new SaleLeadEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(saleLeadEditView);
		saleLeadEditView.trigger('load');
	},

	activityIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '同事圈');
		var activityIndexView = new ActivityIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(activityIndexView);
		activityIndexView.trigger('load');
	},

	phoneIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '同事圈');
		var phoneIndexView = new PhoneIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(phoneIndexView);
		phoneIndexView.trigger('load');
	},

});
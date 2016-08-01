var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var RegisterView = require('../user/views/common/Register');
var ForgotPasswordView = require('../user/views/common/ForgotPassword');
var LoginView = require('../user/views/common/Login');
var WeChatLoginView = require('../user/views/common/WeChatLogin');
var MyAccountViewView = require('../user/views/common/MyAccountView');
var MyAccountEditView = require('../user/views/common/MyAccountEdit');
var FeedbackIndexView = require('../user/views/common/FeedbackIndex');
var FeedbackEditView = require('../user/views/common/FeedbackEdit');

var IndexView = require('../user/views/Index');
var ActivityIndexView = require('../user/views/ActivityIndex');

var HelpIndexView = require('../user/views/HelpIndex');
var MeIndexView = require('../user/views/MeIndex');
var MeChangePassView = require('../user/views/MeChangePass');
var MeBankView = require('../user/views/MeBank');
var MeBonusView = require('../user/views/MeBonus');
var MeBonusOrderView = require('../user/views/MeBonusOrder');
var RankTeamView = require('../user/views/RankTeam');
var RankPersonView = require('../user/views/RankPerson');
var CategoryIndexView = require('../user/views/CategoryIndex');
var CategoryProductView = require('../user/views/CategoryProducts');
var ProductHotsView = require('../user/views/ProductHots');
var ProductOrderView = require('../user/views/ProductOrder');
var OrderIndexView = require('../user/views/OrderIndex');
var CustomerIndexView = require('../user/views/CustomerIndex');
var SaleLeadIndexView = require('../user/views/SaleLeadIndex');
var SaleLeadEditView = require('../user/views/SaleLeadEdit');

exports = module.exports = Backbone.Router.extend({

	appCode: config.app.nickname,
	account: null, //login account
	logined: false,
	currentView: null,
	appEvents: _.extend({}, Backbone.Events), //app events

	routes: {
		'authorized': 'authorized',

		'index': 'index',
		'login': 'login',
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
		'product/view/:id': 'productOrder',//** 产品推荐

		'activity/index': 'activityIndex',
		'order/index': 'orderIndex',
		'customer/index': 'customerIndex',

		'sale/lead/index': 'saleLeadIndex',
		'sale/lead/edit/:id': 'saleLeadEdit',

		'*path': 'index',
		// 'index': 'index',
		// 'login': 'login',
		// 'logout': 'logout',
		// 'register': 'register',
		// 'forgotpassword': 'forgotPassword',
		// 'profile/:id': 'profileView',
		// 'profile/edit/me': 'profileEdit',
		// 'feedback/index': 'feedbackIndex',
		// 'feedback/add': 'feedbackEdit',

		// 'activity/index': 'activityIndex',
		// 'push/index': 'pushIndex',
		// 'push/view/:id': 'pushView',
		// 'data/index': 'dataIndex',
		// 'data/view/:id': 'dataView',
		// 'sms/index': 'smsIndex',
		// 'sms/view/:id': 'smsView',
		// 'card/index': 'cardIndex',
		// 'card/view/:id': 'cardView',
		// 'phone/index': 'phoneIndex',
		// 'phone/view/:id': 'phoneView',
		// 'phone/detail/:id': 'phoneDetail',
		// 'order/index': 'orderIndex',
		// 'customer/index': 'customerIndex',
		// 'revenue/index': 'revenueIndex',
		// 'revenue/stat': 'revenueStat',
		// 'sale/lead/index': 'saleLeadIndex',
		// 'sale/lead/edit/:id': 'saleLeadEdit',

		// '*path': 'index',
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

	authorized: function(){
		
		this.navigate("index", {trigger: true, replace: true});
	},

	index: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '贵州联通沃助手');
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
		//this.appEvents.trigger('set:brand', '产品推荐');
		var productOrderView = new ProductOrderView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productOrderView);
		productOrderView.trigger('load');
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
});
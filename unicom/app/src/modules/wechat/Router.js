var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');


var LayoutView = require('./views/__Layout');
var RegisterView = require('../../views/_Register');
var ForgotPasswordView = require('../../views/_ForgotPassword');
var LoginView = require('../../views/_Login');
var MyAccountViewView = require('../../views/_MyAccountView');
var MyAccountEditView = require('../../views/_MyAccountEdit');
var IndexView = require('../user/views/Index');
var ActivityIndexView = require('../user/views/_ActivityIndex');
var FeedbackIndexView = require('../../views/_FeedbackIndex');
var FeedbackEditView = require('../../views/_FeedbackEdit');

var IndexView = require('../user/views/Index');
var PushIndexView = require('../user/views/_PushIndex');
var PushViewView = require('../user/views/_PushView');
var DataIndexView = require('../user/views/_DataIndex');
var DataViewView = require('../user/views/_DataView');
var SmsIndexView = require('../user/views/_SmsIndex');
var SmsViewView = require('../user/views/_SmsView');
var CardIndexView = require('../user/views/_CardIndex');
var CardViewView = require('../user/views/_CardView');
var PhoneIndexView = require('../user/views/_PhoneIndex');
var PhoneViewView = require('../user/views/_PhoneView');
var PhoneDetailView = require('../user/views/_PhoneDetail');
var OrderIndexView = require('../user/views/_OrderIndex');
var CustomerIndexView = require('../user/views/_CustomerIndex');
var RevenueIndexView = require('../user/views/_RevenueIndex');
var RevenueStatView = require('../user/views/_RevenueStat');

var SaleLeadIndexView = require('../user/views/_SaleLeadIndex');
var SaleLeadEditView = require('../user/views/_SaleLeadEdit');


var config = require('./conf');

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

		'activity/index': 'activityIndex',
		'push/index': 'pushIndex',
		'push/view/:id': 'pushView',
		'data/index': 'dataIndex',
		'data/view/:id': 'dataView',
		'sms/index': 'smsIndex',
		'sms/view/:id': 'smsView',
		'card/index': 'cardIndex',
		'card/view/:id': 'cardView',
		'phone/index': 'phoneIndex',
		'phone/view/:id': 'phoneView',
		'phone/detail/:id': 'phoneDetail',
		'order/index': 'orderIndex',
		'customer/index': 'customerIndex',
		'revenue/index': 'revenueIndex',
		'revenue/stat': 'revenueStat',
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
		this.appEvents.trigger('set:brand','注册');
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
		this.appEvents.trigger('set:brand','找回密码');
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
		this.appEvents.trigger('set:brand', '登录');
		var loginView = new LoginView({
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

	cardIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '号卡');
		var cardIndexView = new CardIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(cardIndexView);
		cardIndexView.trigger('load');
	},


	cardView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '卡号推荐');
		var cardViewView = new CardViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(cardViewView);
		cardViewView.trigger('load');
	},

	pushIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '内容推荐');
		var pushIndexView = new PushIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(pushIndexView);
		pushIndexView.trigger('load');
	},

	pushView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '内容推荐');
		var pushViewView = new PushViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(pushViewView);
		pushViewView.trigger('load');
	},

	dataIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '流量推荐');
		var dataIndexView = new DataIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(dataIndexView);
		dataIndexView.trigger('load');
	},

	dataView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '流量推荐');
		var dataViewView = new DataViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(dataViewView);
		dataViewView.trigger('load');
	},

	smsIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '增值服务');
		var smsIndexView = new SmsIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(smsIndexView);
		smsIndexView.trigger('load');
	},

	smsView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '增值服务');
		var smsViewView = new SmsViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(smsViewView);
		smsViewView.trigger('load');
	},


	phoneIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '号卡');
		var phoneIndexView = new PhoneIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(phoneIndexView);
		phoneIndexView.trigger('load');
	},

	phoneView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '卡号推荐');
		var phoneViewView = new PhoneViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(phoneViewView);
		phoneViewView.trigger('load');
	},

	phoneDetail: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '卡号推荐');
		var phoneDetailView = new PhoneDetailView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(phoneDetailView);
		phoneDetailView.trigger('load');
	},

	orderIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '我的成绩');
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
		this.appEvents.trigger('set:brand', '我的客户');
		var customerIndexView = new CustomerIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(customerIndexView);
		customerIndexView.trigger('load');
	},

	activityIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '同事圈');
		var activityIndexView = new ActivityIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(activityIndexView);
		activityIndexView.trigger('load');
	},

	revenueIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的金币');
		var revenueIndexView = new RevenueIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(revenueIndexView);
		revenueIndexView.trigger('load');
	},


	revenueStat: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的金币');
		var revenueStatView = new RevenueStatView({
			router: this,
			el: '#content'
		});
		this.changeView(revenueStatView);
		revenueStatView.trigger('load');
	},

	saleLeadIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的成绩');
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
		//this.appEvents.trigger('set:brand', '流量推荐');
		var saleLeadEditView = new SaleLeadEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(saleLeadEditView);
		saleLeadEditView.trigger('load');
	},

});
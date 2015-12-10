var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('./views/_AccountLogin');
var ProfileViewView = require('./views/_AccountView');
var IndexView = require('./views/Index');

var AccountIndexView = require('./views/_AccountIndex');
var AccountAddView = require('./views/_AccountAdd');
var AccountEditView = require('./views/_AccountEdit');

var ChannelEntityIndexView = require('./views/_ChannelEntityIndex');
var ChannelEntityAddView = require('./views/_ChannelEntityAdd');
var ChannelEntityEditView = require('./views/_ChannelEntityEdit');

var ChannelCustomerIndexView = require('./views/_ChannelCustomerIndex');
var ChannelCustomerAddView = require('./views/_ChannelCustomerAdd');
var ChannelCustomerEditView = require('./views/_ChannelCustomerEdit');

var PageRecommendIndexView = require('./views/_PageRecommendIndex');
var PageRecommendAddView = require('./views/_PageRecommendAdd');
var PageRecommendEditView = require('./views/_PageRecommendEdit');

var ProductCardIndexView = require('./views/_ProductCardIndex');
var ProductCardAddView = require('./views/_ProductCardAdd');
var ProductCardEditView = require('./views/_ProductCardEdit');
var ProductCardImportView = require('./views/_ProductCardImport');

var OrderCardIndexView = require('./views/_OrderCardIndex');
var OrderCardAddView = require('./views/_OrderCardAdd');
var OrderCardEditView = require('./views/_OrderCardEdit');
var OrderCardViewView = require('./views/_OrderCardView');

exports = module.exports = Backbone.Router.extend({

	account: null,//login account
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
		'profile/:id': 'profileView',
		'account/index': 'accountIndex',
		'account/add': 'accountAdd',
		'account/edit/:id': 'accountEdit',
		'channel/index': 'channelIndex',
		'channel/add': 'channelAdd',
		'channel/edit/:id': 'channelEdit',
		'customer/index': 'customerIndex',
		'customer/add': 'customerAdd',
		'customer/edit/:id': 'customerEdit',
		'recommend/index': 'recommendIndex',
		'recommend/add': 'recommendAdd',
		'recommend/edit/:id': 'recommendEdit',
		'card/index': 'cardIndex',
		'card/add': 'cardAdd',
		'card/edit/:id': 'cardEdit',
		'card/import': 'cardImport',
		'order/card/index': 'orderCardIndex',
		'order/card/add': 'orderCardAdd',
		'order/card/view/:id': 'orderCardView',
		'order/card/edit/:id': 'orderCardEdit',

		'*path': 'index',
	},

	initialize: function(){
		this.appEvents.on('logined',this.onLogined,this);
		this.appEvents.on('logout', this.onLogout,this);
		var layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		layoutView.trigger('load');
	},

	onLogined: function(account){
		// console.log('++')
		// console.log(account);
		this.account = account;
		this.logined = true;
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
		var profileViewView = new ProfileViewView({
			el: '#content',
			id: id,
			appEvents: this.appEvents,
		});
		this.changeView(profileViewView);
		profileViewView.trigger('load');
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

	accountAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增账号');
		var accountAddView = new AccountAddView({
			router: this,
			el: '#content',
		});
		this.changeView(accountAddView);
		accountAddView.trigger('load');
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

	channelIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','渠道管理');
		var channelIndexView = new ChannelEntityIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(channelIndexView);
		channelIndexView.trigger('load');
	},	

	channelAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增渠道');
		var channelAddView = new ChannelEntityAddView({
			router: this,
			el: '#content',
		});
		this.changeView(channelAddView);
		channelAddView.trigger('load');
	},	

	channelEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改渠道');
		var channelEditView = new ChannelEntityEditView({
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
		var customerIndexView = new ChannelCustomerIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(customerIndexView);
		customerIndexView.trigger('load');
	},	

	customerAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增客户');
		var customerAddView = new ChannelCustomerAddView({
			router: this,
			el: '#content',
		});
		this.changeView(customerAddView);
		customerAddView.trigger('load');
	},	

	customerEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改客户');
		var customerEditView = new ChannelCustomerEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(customerEditView);
		customerEditView.trigger('load');
	},	

	recommendIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','推荐管理');
		var recommendIndexView = new PageRecommendIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(recommendIndexView);
		recommendIndexView.trigger('load');
	},	

	recommendAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增推荐');
		var recommendAddView = new PageRecommendAddView({
			router: this,
			el: '#content',
		});
		this.changeView(recommendAddView);
		recommendAddView.trigger('load');
	},	

	recommendEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改推荐');
		var recommendEditView = new PageRecommendEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(recommendEditView);
		recommendEditView.trigger('load');
	},		

	cardIndex: function(){
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

	cardAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增卡号');
		var cardAddView = new ProductCardAddView({
			router: this,
			el: '#content',
		});
		this.changeView(cardAddView);
		cardAddView.trigger('load');
	},	

	cardImport: function(){
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

	cardEdit: function(id){
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

	orderCardIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','卡号订单管理');
		var orderCardIndexView = new OrderCardIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(orderCardIndexView);
		orderCardIndexView.trigger('load');
	},	

	orderCardAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增卡号订单');
		var orderCardAddView = new OrderCardAddView({
			router: this,
			el: '#content',
		});
		this.changeView(orderCardAddView);
		orderCardAddView.trigger('load');
	},	

	orderCardEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改卡号订单');
		var orderCardEditView = new OrderCardEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(orderCardEditView);
		orderCardEditView.trigger('load');
	},				

	orderCardView: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','查看卡号订单');
		var orderCardViewView = new OrderCardViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(orderCardViewView);
		orderCardViewView.trigger('load');
	},	
});
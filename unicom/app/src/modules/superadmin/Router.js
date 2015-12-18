var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('./views/_AccountLogin');
var IndexView = require('./views/Index');

var PlatformAppIndexView = require('./views/_PlatformAppIndex');
var PlatformAppEditView = require('./views/_PlatformAppEdit');

var FeatureIndexView = require('./views/_FeatureIndex');
var FeatureEditView = require('./views/_FeatureEdit');

var RoleIndexView = require('./views/_RoleIndex');
var RoleEditView = require('./views/_RoleEdit');

var ChannelCategoryIndexView = require('./views/_ChannelCategoryIndex');
var ChannelCategoryAddView = require('./views/_ChannelCategoryAdd');
var ChannelCategoryEditView = require('./views/_ChannelCategoryEdit');

var DepartmentIndexView = require('./views/_DepartmentIndex');
var DepartmentEditView = require('./views/_DepartmentEdit');

var GridIndexView = require('./views/_GridIndex');
var GridEditView = require('./views/_GridEdit');

exports = module.exports = Backbone.Router.extend({

	account: null,//login account
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
		'platform/app/index': 'platformAppIndex',
		'platform/app/add': 'platformAppEdit',	
		'platform/app/edit/:id': 'platformAppEdit',
		'feature/index': 'featureIndex',
		'feature/add': 'featureEdit',	
		'feature/edit/:id': 'featureEdit',
		'role/index': 'roleIndex',
		'role/add': 'roleEdit',
		'role/edit/:id': 'roleEdit',
		'channel/category/index': 'channelCategoryIndex',
		'channel/category/add': 'channelCategoryAdd',
		'channel/category/edit/:id': 'channelCategoryEdit',
		'grid/index': 'gridIndex',
		'grid/add': 'gridEdit',
		'grid/edit/:id': 'gridEdit',		
		'department/index': 'departmentIndex',
		'department/add': 'departmentEdit',
		'department/edit/:id': 'departmentEdit',
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
		//this.appEvents.trigger('set:brand','首页');
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
		//this.appEvents.trigger('set:brand','登录');
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
			url: config.api.host + '/super/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
	},

	platformAppIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		var platformAppIndexView = new PlatformAppIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(platformAppIndexView);
		platformAppIndexView.trigger('load');
	},

	platformAppEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		var platformAppEditView = new PlatformAppEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(platformAppEditView);
		platformAppEditView.trigger('load');
	},
	
	featureIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','功能设置');
		var featureIndexView = new FeatureIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(featureIndexView);
		featureIndexView.trigger('load');
	},

	featureEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','修改功能');
		var featureEditView = new FeatureEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(featureEditView);
		featureEditView.trigger('load');
	},

	roleIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','角色设置');
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
		//this.appEvents.trigger('set:brand','修改角色');
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
		//this.appEvents.trigger('set:brand','渠道类型设置');
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
		//this.appEvents.trigger('set:brand','新增渠道类型');
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
		//this.appEvents.trigger('set:brand','修改渠道类型');
		var channelCategoryEditView = new ChannelCategoryEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(channelCategoryEditView);
		channelCategoryEditView.trigger('load');
	},

	gridIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','网格设置');
		var gridIndexView = new GridIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(gridIndexView);
		gridIndexView.trigger('load');
	},

	gridEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','修改网格');
		var gridEditView = new GridEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(gridEditView);
		gridEditView.trigger('load');
	},

	departmentIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','组织设置');
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
		//this.appEvents.trigger('set:brand','修改组织');
		var departmentEditView = new DepartmentEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(departmentEditView);
		departmentEditView.trigger('load');
	},
});
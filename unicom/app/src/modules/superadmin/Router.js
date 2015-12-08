var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('./views/_AccountLogin');
var IndexView = require('./views/Index');

var FeatureIndexView = require('./views/_FeatureIndex');
var FeatureEditView = require('./views/_FeatureEdit');
var FeatureAddView = require('./views/_FeatureAdd');

var RoleIndexView = require('./views/_RoleIndex');
var RoleEditView = require('./views/_RoleEdit');
var RoleAddView = require('./views/_RoleAdd');

var ChannelCategoryIndexView = require('./views/_ChannelCategoryIndex');
var ChannelCategoryAddView = require('./views/_ChannelCategoryAdd');
var ChannelCategoryEditView = require('./views/_ChannelCategoryEdit');

var DepartmentIndexView = require('./views/_DepartmentIndex');
var DepartmentAddView = require('./views/_DepartmentAdd');
var DepartmentEditView = require('./views/_DepartmentEdit');

var GridIndexView = require('./views/_GridIndex');
var GridAddView = require('./views/_GridAdd');
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
		'feature/index': 'featureIndex',
		'feature/add': 'featureAdd',	
		'feature/edit/:id': 'featureEdit',
		'role/index': 'roleIndex',
		'role/add': 'roleAdd',
		'role/edit/:id': 'roleEdit',
		'channel/category/index': 'channelCategoryIndex',
		'channel/category/add': 'channelCategoryAdd',
		'channel/category/edit/:id': 'channelCategoryEdit',
		'grid/index': 'gridIndex',
		'grid/add': 'gridAdd',
		'grid/edit/:id': 'gridEdit',		
		'department/index': 'departmentIndex',
		'department/add': 'departmentAdd',
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
			url: config.api.host + '/super/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
	},

	featureIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','功能设置');
		var featureIndexView = new FeatureIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(featureIndexView);
		featureIndexView.trigger('load');
	},

	featureAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增功能');
		var featureAddView = new FeatureAddView({
			router: this,
			el: '#content',
		});
		this.changeView(featureAddView);
		featureAddView.trigger('load');
	},

	featureEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改功能');
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
		this.appEvents.trigger('set:brand','角色设置');
		var roleIndexView = new RoleIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(roleIndexView);
		roleIndexView.trigger('load');
	},
	roleAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增角色');
		var roleAddView = new RoleAddView({
			router: this,
			el: '#content',
		});
		this.changeView(roleAddView);
		roleAddView.trigger('load');
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
		this.appEvents.trigger('set:brand','渠道类型设置');
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

	gridIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','网格设置');
		var gridIndexView = new GridIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(gridIndexView);
		gridIndexView.trigger('load');
	},

	gridAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增网格');
		var gridAddView = new GridAddView({
			router: this,
			el: '#content',
		});
		this.changeView(gridAddView);
		gridAddView.trigger('load');
	},

	gridEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改网格');
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
		this.appEvents.trigger('set:brand','组织设置');
		var departmentIndexView = new DepartmentIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(departmentIndexView);
		departmentIndexView.trigger('load');
	},

	departmentAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增组织');
		var departmentAddView = new DepartmentAddView({
			router: this,
			el: '#content',
		});
		this.changeView(departmentAddView);
		departmentAddView.trigger('load');
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
});
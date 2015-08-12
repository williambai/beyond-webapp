define(['views/Index','views/login','views/Layout','views/UserIndex','views/UserEdit','views/UserApp','views/Profile','views/VerifySingle','views/RecordIndex','views/IdInfo'], function(IndexView,LoginView,LayoutView,UserIndexView,UserEditView,UserAppView,ProfileView,VerifySingleView,RecordIndexView,IdInfoView){

	var Router = Backbone.Router.extend({
		account: null,
		logined: false,
		currentView : null,
		appEvents: _.extend({},Backbone.Events),

		routes: {
			'': 'index',
			'index': 'index',
			'login': 'login', 
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'forgotpassword/success': 'forgotPasswordSuccess',
			'profile': 'profile',
			'profile/me/edit': 'profileEdit',
			'user/index': 'userIndex',
			'user/edit/:id': 'userEdit',
			'user/app/:id': 'userApp',
			'user/add': 'userAdd', 
			'verify/single': 'verifySingle',
			'id/info': 'idInfo',
			'record/index': 'recordIndex',
		},

		changeView: function(view){
			if(null != this.currentView){
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		
		initialize: function(){
			this.appEvents.on('logined',this.onLogined,this);
			this.appEvents.on('logout', this.onLogout,this);
			this.layoutView = new LayoutView({
				account: this.account,
				appEvents: this.appEvents,
			});
			this.layoutView.trigger('load');
		},

		onLogined: function(account){
			this.account = account;
			this.logined = true;
			this.layoutView.account = this.account;
			this.layoutView.trigger('load');
			window.location.hash = 'index';
		},

		onLogout: function(){
			this.logined = false;
			this.account = null;
			this.layoutView.account = this.account;
			this.layoutView.trigger('load');
			window.location.hash = 'login';
		},

		index: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','主页');
			this.changeView(new IndexView());
		},

		register: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','注册');
			this.changeView(new RegisterView());
		},

		login: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','登录');
			this.changeView(new LoginView({
				appEvents: this.appEvents
			}));
		},

		forgotPassword: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','找回密码');
			this.changeView(new ForgotPasswordView());
		},

		forgotPasswordSuccess: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','找回密码');
			this.changeView(new ForgotPasswordSuccessView());
		},

		profile: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','个人资料');
			var profileView = new ProfileView({
					appEvents: this.appEvents,
				});
			this.changeView(profileView);
			profileView.trigger('load');
		},

		profileEdit: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','编辑个人资料');
			var profileEditView = new ProfileEditView();
			this.changeView(profileEditView);
			profileEditView.trigger('load');
		},

		userIndex: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.admin || this.account.roles.agent){
				this.appEvents.trigger('set:brand','用户管理');
				var userIndexView = new UserIndexView({account: this.account});
				this.changeView(userIndexView);
				userIndexView.trigger('load');
			}
		},

		userEdit: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.admin || this.account.roles.agent){
				this.appEvents.trigger('set:brand', '编辑用户');
				var userEditView = new UserEditView({id: id,account: this.account});
				this.changeView(userEditView);
				userEditView.trigger('load');
			}
		},

		userApp: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.admin || this.account.roles.agent){
				this.appEvents.trigger('set:brand', '应用管理');
				var userAppView = new UserAppView({id: id,account: this.account});
				this.changeView(userAppView);
				userAppView.trigger('load');
			}
		},

		userAdd: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.admin || this.account.roles.agent){
				this.appEvents.trigger('set:brand', '新增用户');
				var userEditView = new UserEditView({id: null, account: this.account});
				this.changeView(userEditView);
				userEditView.trigger('load');
			}
		},

		verifySingle: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.user){
				this.appEvents.trigger('set:brand', '一致性校验');
				var verifySingleView = new VerifySingleView({id: null, account: this.account});
				this.changeView(verifySingleView);
				verifySingleView.trigger('load');
			}
		},

		idInfo: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.user){
				this.appEvents.trigger('set:brand', '身份证号信息解读');
				var idInfoView = new IdInfoView({id: null, account: this.account});
				this.changeView(idInfoView);
				idInfoView.trigger('load');
			}
		},

		recordIndex: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			if(this.account.roles.user || this.account.roles.app){
				this.appEvents.trigger('set:brand','使用记录');
				var recordIndexView = new RecordIndexView({account: this.account});
				this.changeView(recordIndexView);
				recordIndexView.trigger('load');
			}
		},


	});

	return new Router();
});
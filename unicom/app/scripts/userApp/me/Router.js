var Router = require('../_base/__Router');
var MeIndexView = require('./views/MeIndex');
var MeChangePassView = require('./views/MeChangePass');
var MeBankView = require('./views/MeBank');
var MeBonusView = require('./views/MeBonus');
var MeBonusOrderView = require('./views/MeBonusOrder');

exports = module.exports = Router.extend({

	routes: {
		'me/index': 'meIndex',
		'me/changepass': 'meChangePass',
		'me/bank': 'meBank',
		'me/bonus': 'meBonus',
		'me/bonus/:id': 'meBonusOrder',
		'me/order': 'orderIndex',
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
		this.appEvents.trigger('changeView',meIndexView);
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
		this.appEvents.trigger('changeView',meChangePassView);
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
		this.appEvents.trigger('changeView',meBankView);
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
		this.appEvents.trigger('changeView',meBonusView);
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
		this.appEvents.trigger('changeView',meBonusOrderView);
		meBonusOrderView.trigger('load');
	},	

});
var Router = require('../_base/__Router');
var RankTeamView = require('./views/RankTeam');
var RankPersonView = require('./views/RankPerson');

exports = module.exports = Router.extend({

	routes: {
		'rank/person': 'rankPerson',
		'rank/team': 'rankTeam',
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


});
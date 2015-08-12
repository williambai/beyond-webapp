define([],function(){

	var Account = Backbone.Model.extend({

		defaults: {
			roles: {
				admin: false,
				agent: false,
				user: true,
				app: false,
			},
			business: {
				stage: 'test',
				times: 10,
				expired: new Date()
			},
			app: {
				app_id: '',
				app_secret: '',
				apis: {
					base: false,
					photoBase: false
				}
			},
			balance: 0,
			enable: true,
		},

	});
	
	return Account;
});
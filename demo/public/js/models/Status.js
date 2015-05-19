define([],function(){
	var Status = Backbone.Model.extend({
		urlRoot: '/accounts/' + this.accountId + '/status'
	});

	return Status;
});
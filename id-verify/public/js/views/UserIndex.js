define(['text!templates/userIndex.tpl','views/_ListUser'], 
	function(UserIndexTemplate,UserListView){
	var UserIndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(UserIndexTemplate),

		initialize: function(options){
			this.account = options.account;
			this.on('load', this.load, this);
		},

		events: {
			'submit form': 'search'
		},

		load: function(){
			this.userListView = new UserListView({
				account: this.account,
				url: '/accounts?type=search&searchStr='
			});
			this.userListView.trigger('load');
		},

		search: function(){
			var that = this;
			this.userListView.collection.url = '/accounts?type=search&searchStr=' + $('input[name=searchStr]').val();
			this.userListView.collection.fetch({reset: true});
			// $.ajax('/accounts/find?searchStr=' + $('input[name=searchStr]').val(),{
			// 	mathod: 'GET',
			// 	sucess: function(data){
			// 		console.log('+++')
			// 		that.userListView.collection.reset(data);
			// 	},
			// 	error: function(){
			// 		$('#userlist').text('没有找到。');
			// 		$('#userlist').slidedown();
			// 	}
			// });
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return UserIndexView;
});
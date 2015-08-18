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
			'scroll': 'scroll',
			'submit form': 'search'
		},

		load: function(){
			this.userListView = new UserListView({
				account: this.account,
				url: '/accounts'
			});
			this.userListView.collectionUrl = '/accounts';
			this.userListView.trigger('load');
		},
		scroll: function(){
			this.userListView.scroll();
			return false;
		},
		search: function(){
			var that = this;
			this.userListView.$el.empty();
			var url = '/accounts?type=search&searchStr=' + $('input[name=searchStr]').val();
			this.userListView.collectionUrl = url;
			this.userListView.collection.url = url;
			this.userListView.collection.fetch({reset: true});
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return UserIndexView;
});
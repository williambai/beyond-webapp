define(['views/ListView','views/Status','models/Status','models/StatusCollection'],
	function(ListView,StatusView,Status,StatusCollection){

	var StatusListView = ListView.extend({

		Status: StatusView,
		initialize: function(options){
			this.accountId = options.id;
			this.account = options.account;
			options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);

			this.collection = new StatusCollection();
			this.collection.url = options.url;//'/accounts/'+ options.id + '/activity';
			this.collectionUrl = this.collection.url;

			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectonReset, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.collection.fetch();
		},

		onSocketStatusAdded: function(data){
			var fromId = data.from;
			data = data.data;
			var status = new Status({
					fromId: fromId,
					username: data.username,
					avatar: data.avatar,
					status: data.status
				});
			//新进来的Status加在前面
			var statusHtml = (new StatusView({account: this.account,model: status})).render().el;
			$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
			this.collection.add(status,{silent: true});
		},

		onStatusCollectonReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.onStatusAdded(model);
			});
		},

		onStatusAdded: function(status){
			var statusHtml = (new StatusView({account: this.account,model: status})).render().el;
			$(statusHtml).appendTo('.status-list').hide().fadeIn('slow');
		},

		render: function(){
			return this;
		},

		nextPage: function(){
			++this.page;
			this.collection.url = this.collectionUrl + '?page=' + this.page;
			this.collection.fetch();
		},


	});
	return StatusListView;
});
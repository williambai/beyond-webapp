define(['views/__ScrollableView','views/_ItemStatus','models/Status','models/StatusCollection'],
	function(ScrollableView,StatusView,Status,StatusCollection){

	var StatusListView = ScrollableView.extend({

		StatusView: StatusView,
		initialize: function(options){
			if(options.StatusView){
				this.StatusView = options.StatusView;
			}
			this.account = options.account;

			this.collection = new StatusCollection();
			this.collection.url = options.url;//'/accounts/'+ options.id + '/activity';
			this.collectionUrl = this.collection.url;

			this.collection.on('reset', this.onStatusCollectonReset, this);
			this.collection.on('add:prepend', this.onStatusAdded,this);
			this.collection.on('add', this.append,this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.collection.fetch({reset:true});
		},

		onStatusAdded: function(data){
			var status = new Status(data);
			//新进来的Status加在前面
			this.collection.add(status,{silent: true,at: 0});
			this.prepend(status);
		},

		onStatusCollectonReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.append(model);
			});
		},

		prepend: function(status){
			var statusHtml = (new this.StatusView({account: this.account,model: status})).render().el;
			$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
		},

		append: function(status){
			var statusHtml = (new this.StatusView({account: this.account,model: status})).render().el;
			$(statusHtml).appendTo('.status-list').hide().fadeIn('slow');
		},

		render: function(){
			return this;
		},

	});
	return StatusListView;
});
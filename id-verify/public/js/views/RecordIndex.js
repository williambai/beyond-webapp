define(['text!templates/recordIndex.tpl','views/_ListRecord'], 
	function(recordIndexTemplate,RecordListView){
	var RecordIndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(recordIndexTemplate),

		initialize: function(options){
			this.account = options.account;
			this.on('load', this.load, this);
		},

		events: {
			'scroll': 'scroll',
			'submit form': 'search'
		},

		load: function(){
			this.recordListView = new RecordListView({
				account: this.account,
				url: '/records'
			});
			this.recordListView.collectionUrl = '/records';
			this.recordListView.trigger('load');
		},

		scroll: function(){
			this.recordListView.scroll();
			return false;
		},

		search: function(){
			var that = this;
			this.recordListView.$el.empty();
			var url = '/records?type=search&searchStr=' + $('input[name=searchStr]').val();
			this.recordListView.collection.url = url;
			this.recordListView.collectionUrl = url;
			this.recordListView.collection.fetch({reset: true});
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return RecordIndexView;
});
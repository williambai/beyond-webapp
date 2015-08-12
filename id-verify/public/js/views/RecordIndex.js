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
			'submit form': 'search'
		},

		load: function(){
			this.recordListView = new RecordListView({
				account: this.account,
				url: '/records'
			});
			this.recordListView.trigger('load');
		},

		search: function(){
			var that = this;
			this.recordListView.collection.url = '/records?type=search&searchStr=' + $('input[name=searchStr]').val();
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
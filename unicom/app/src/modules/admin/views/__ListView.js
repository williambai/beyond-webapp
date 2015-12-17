var __ListView = require('../../../views/__ListView');

exports = module.exports = __ListView.extend({
	refresh: function(query){
		this.$el.empty();
		this.collection.url = this.collectionUrl + '?' + query;
		this.collection.fetch({
			reset: true,
			xhrFields: {
				withCredentials: true
			},
		});
	},
});

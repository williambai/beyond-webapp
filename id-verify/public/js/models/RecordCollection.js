define(['models/Record'], function(Record){
	var RecordCollection = Backbone.Collection.extend({
		model: Record,

	});
	return RecordCollection;
});
define(['models/Project'],function(Project){
	var ProjectCollection = Backbone.Collection.extend({
		model: Project
	});
	return ProjectCollection;
});
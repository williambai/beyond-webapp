var _ = require('underscore');
var ItemProjectView = require('./_ItemProject'),
    projectItemTemplate = require('../../assets/templates/_itemProject2.tpl');

exports = module.exports = ItemProjectView.extend({

	render: function(){
		this.$el.html(projectItemTemplate(this.model.toJSON()));
		return this;
	}
});
var LayoutView = require('./__Layout');
var layoutTemplate = require('../templates/_layoutResetPassword.tpl');
var loadingTemplate = require('../templates/loading.tpl');

exports = module.exports = LayoutView.extend({
	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(layoutTemplate());
		}
		return this;
	}
});
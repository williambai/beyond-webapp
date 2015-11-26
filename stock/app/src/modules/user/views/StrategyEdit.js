var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	template = require('../templates/strategyEdit.tpl');
var config = require('../conf');

Backbone.$ = $;

var StrategyForm = require('./_FormStrategy');

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	// compiled: _.template(template),

	initialize: function(options) {
		this.symbol = options.symbol;
		this.on('load', this.load, this);
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.strategyForm = new StrategyForm({symbol: this.symbol});
		this.strategyForm.success = function(){

		};
		this.strategyForm.model.on('change',this.render,this);
		// this.render();
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(template({model:this.strategyForm.model.toJSON()}));
			// this.$el.html(this.compiled({model:this.strategyForm.model.toJSON()}));
		}
		return this;
	},
});
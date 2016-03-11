var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityTradePortfolio.tpl'),
	TradePortfolio = require('../models/TradePortfolio');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		var page = $(strategyTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model = new TradePortfolio();
		this.model._id = options.id;
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
	},

	load: function(){
		this.model.url = this.model.url + '/' + this.model._id;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	done: function(response){
		this.render();
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
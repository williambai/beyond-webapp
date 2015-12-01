var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
	TradingStrategy = require('../models/TradingStrategy');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		var page = $(strategyTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		this.model = new TradingStrategy();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		this.render();
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		if(object.status.code == 0){
			object.status.message = '停止交易';
		}else{
			object.status.message = '正常交易';
		}
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	done: function(response){
		window.location.hash = 'strategy';
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
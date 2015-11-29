var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
	TradingStrategy = require('../models/TradingStrategy');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		var page = $(strategyTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new TradingStrategy();
		this.model._id = options.id;
		FormView.prototype.initialize.apply(this, options);
		this.model.on('sync', this.render, this);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		if(this.model._id){
			this.model.url = this.model.url + '/' + this.model._id;
			this.model.fetch({
				xhrFields: {
					withCredentials: true
				},
			});
		}else{
			this.render();
		}
	},

	submit: function() {
		var that = this;
		var arr = this.$('form').serializeJSON();
		this.model.set(arr);
		if(arr.status.code == 0){
			arr.status.message = '停止交易';
		}else{
			arr.status.message = '正常交易';
		}
		console.log(this.model.toJSON());

		// if (this.model.isValid()) {
		// 	this.model.save(null, {
		// 		xhrFields: {
		// 			withCredentials: true
		// 		},
		// 	});
		// }
		return false;
	},
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
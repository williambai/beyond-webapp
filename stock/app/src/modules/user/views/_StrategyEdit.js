var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
	TradingStrategy = require('../models/TradingStrategy');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	modelFilled: false,

	initialize: function(options) {
		var page = $(strategyTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new TradingStrategy();
		this.model._id = options.id;
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		this.model.url = this.model.url + '/' + this.model._id;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
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
	
	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			window.location.hash = 'strategy';
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityTradeStrategy.tpl'),
	TradeStrategy = require('../models/TradeStrategy');
	TradePortfolio = require('../models/TradePortfolio');

exports = module.exports = FormView.extend({

	el: '#investForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new TradeStrategy({_id: options.id});
		var page = $(strategyTpl);
		var investTemplate = $('#investTemplate', page).html();
		this.template = _.template(_.unescape(investTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},


	submit: function() {
		if(window.confirm('将该品种创建或更新到投资组合，您确信要实施吗？')){
			var that = this;
			//clear errors
			this.$('.form-group').removeClass('has-error');
			this.$('.form-group').find('span.help-block').empty();
			var arr = this.$('form').serializeArray();
			var errors = [];
			_.each(arr,function(obj){
				var error = that.model.preValidate(obj.name,obj.value);
				if(error){
					errors.push(error);
					that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
					that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
				}
			});
			if(!_.isEmpty(errors)) return false;
			//validate finished.

			var strategy = _.omit(this.model.toJSON(),'_id');
			var tradePortfolio = new TradePortfolio(strategy);
			var object = this.$('form').serializeJSON();
			tradePortfolio.set('trader', object);
			// console.log(tradePortfolio.toJSON());
			tradePortfolio.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			that.router.navigate('trade/strategy/index',{trigger: true, replace: true});
			return false;
		}
	},
	
	cancel: function(){
		this.router.navigate('trade/strategy/index',{trigger: true, replace: true});
		return false;
	},

	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			this.router.navigate('trade/strategy/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('.panel-title.main').text('新增交易策略');
		return this;
	},	
});
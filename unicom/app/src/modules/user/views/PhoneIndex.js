var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    phoneTpl = require('../templates/_entityPhoneInfo.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var FormView = require('./__FormView');

Backbone.$ = $;

//** Phone模型
var Phone = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/customer/phones',	
	validation: {
		'mobile': {
			pattern: /^(186|185|156|131|130|155|132)\d{8}$/,
			msg: '请输入有效的联通手机号码'
		},
	}
});

//** view子视图
var PhoneViewView = Backbone.View.extend({
	el: '#view',
	initialize: function(options){
		var page = $(phoneTpl);
		this.model = options.model;
		this.model.on('change', this.render,this);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
	},
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});

//** Search子视图
var PhoneSearchView = Backbone.View.extend({
	el: '#search',

	initialize: function(options){
		var page = $(phoneTpl);
		this.model = new Phone();
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.on('load', this.load,this);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'search'
	},

	load: function(){
		this.render();
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

	search: function(){
		var mobile = this.$('input[name=mobile]').val();
		var model = new Phone();
		model.set('_id', mobile);
		var phoneView = new PhoneViewView({model: model});
		model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	render: function(){
		this.$el.html(this.template());
	},
});


//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(phoneTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.searchView = new PhoneSearchView({
			el: '#search',
		});
		this.searchView.trigger('load');
	},

	back: function(){
		// window.history.back();
		this.router.navigate('index',{trigger: true, replace: true});
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});
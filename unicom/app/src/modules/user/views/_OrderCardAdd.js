var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityOrderCard.tpl'),
	OrderCard = require('../models/OrderCard');
var config = require('../conf');

var CardPackageView = require('../views/_CardPackage');

exports = module.exports = FormView.extend({

	el: '#cardForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new OrderCard();
		var page = $(cardTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click #selectPackage': 'selectPackage',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		var that = this;
		this.render();
		this.$('#package').hide();
		this.cardPackageView = new CardPackageView({
			el: '#package',
		});
		this.cardPackageView.done = function(result){
			console.log(result);
			that.$('#package').hide();
		};

		this.cardPackageView.trigger('load');
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		console.log(this.model.attributes);
		// this.model.save(null, {
		// 	xhrFields: {
		// 		withCredentials: true
		// 	},
		// });
		return false;
	},

	selectPackage: function(){
		this.$('#package').show();
		return false;
	},

	cancel: function(){
		this.router.navigate('card/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('card/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
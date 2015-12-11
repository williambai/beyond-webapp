var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityOrderCard.tpl'),
	OrderCard = require('../models/OrderCard');
var config = require('../conf');

var CardPackageView = require('../views/_OrderCardPackage');

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
		'keyup input[name=mobile]': 'getMobiles',
		'click li.list-group-item': 'selectMobile',
		'click #openPackages': 'openPackages',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		var that = this;
		this.render();
		this.$('#packages').hide();
		this.cardPackageView = new CardPackageView({
			el: '#packages',
		});
		this.cardPackageView.done = function(result){
			// console.log(result);
			that.$('input[name=packageStr]').val(result);
			that.$('#packages').hide();
		};
		this.cardPackageView.trigger('load');
	},

	getMobiles: function(evt){
		this.$('#mobiles').empty();
		var that = this;
		var searchStr = this.$('input[name=mobile]').val() || '';
		if(searchStr.length > 1){
			$.ajax({
				url: config.api.host + '/product/cards?type=search&per=10&searchStr=' + searchStr,
				type: 'GET',
				fields: {
					withCredentials: true
				}
			}).done(function(data){
				data = data || [];
				var mobiles = '<ul class="list-group">';
				data.forEach(function(item){
					mobiles += '<li class="list-group-item">'+ item.cardNo +'</li>';
				});
				mobiles += '</ul>';
				that.$('#mobiles').html(mobiles);
			});
		}
		return false;
	},

	selectMobile: function(evt){
		var cardNo = $(evt.currentTarget).text();
		this.$('input[name=mobile]').val(cardNo);
		this.$('#mobiles').empty();
		return false;
	},

	openPackages: function(){
		this.$('#packages').show();
		return false;
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

	cancel: function(){
		this.router.navigate('order/card/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('order/card/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
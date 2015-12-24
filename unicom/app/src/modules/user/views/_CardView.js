var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
	ProductCard = require('../models/ProductCard');
var config = require('../conf');

Backbone.$ = $;

var CardAddView = require('./_CardAdd');
var CardPackageView = require('./_CardPackage');

exports = module.exports = Backbone.View.extend({

	el: '#cardView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductCard({_id: options.id});
		var page = $(cardTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model.on('change', this.change ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
		'click #togglePackageView': 'togglePackageView',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	togglePackageView: function(){
		this.$('#packageView').show();
		return false;
	},

	change: function(){
		var that = this;
		this.render();
		this.$('#packageView').hide();
		this.cardPackageView = new CardPackageView({
			el: '#packageView',
		});
		this.cardPackageView.done = function(products){
			that.$('#packageView').hide();
			that.packageSelected(products);
		};
		this.cardPackageView.on('ready', function(){
		});
		this.cardPackageView.trigger('load');

		this.recommendView = new CardAddView({
			router: this.router,
			el: '#recommendView',
			cardModel: this.model,
		});
		this.recommendView.on('ready', this.recommendViewReday,this);
		this.recommendView.trigger('load');
	},

	packageSelected: function(products){
		var that = this;
		// console.log(products);
		var packageSelected = '';
		var total = 0;
		_.each(products, function(product){
			packageSelected += product.name + '; ';
			total += product.price;
		});
		this.$('#packageSelected').html(packageSelected);
		this.$('#total').text(total.toFixed(2));
		this.recommendView.trigger('change:product',products);
	},

	recommendViewReday: function(){
		// this.$('input[name="product[card][name]').val(this.model.get('cardNo'));
		// this.$('input[name="product[card][price]').val(this.model.get('price'));
		// this.$('input[name="product[card][category]').val('号卡');
	},

	back: function(){
		window.history.back();
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
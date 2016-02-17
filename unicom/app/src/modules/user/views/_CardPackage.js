var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    cardTpl = require('../templates/_entityCard.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');
// var cardPackage = require('../models/ProductCardPackage');
var cardPackage = [];

var SearchModel = Backbone.Model.extend({

});
exports = module.exports = SearchView.extend({
	el: '#package',

	initialize: function(options){
		this.cardModel = options.cardModel;
		this.model = new SearchModel();
		var page = $(cardTpl);
		var searchTemplate = $('#packageTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.on('load', this.load,this);
	},

	events: {
		'click .tabControl': 'tabControl',
		'click .selectItem': 'selectItem',
		'submit form': 'submit',
	},

	load: function(){
		var that = this;
		$.ajax({
			url: config.api.host + '/product/card/packages?action=cardType&cardType=' + that.cardModel.get('category'),
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			that.cardPackage = data;
			that.render();
			_.each(data, function(cardPackage){
				var category = cardPackage.category || '';
				var html = '';
				switch(category){
					case '套餐A':
						html += '<div class="form-group">';
						// html += '<a class="bg-success selectItem">';
						html += '<input type="radio" name="packageA" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
						// html += '</a>&nbsp';
						html +=	'</div>'; 
						that.$('#tab1').append(html);
						break;
					case '套餐B': 
						html += '<div class="form-group">';
						// html += '<a class="bg-success selectItem">';
						html += '<input type="radio" name="packageB" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
						// html += '</a>&nbsp';
						html +=	'</div>'; 
						that.$('#tab2').append(html);
						break;
					case '套餐C': 
						html += '<div class="form-group">';
						// html += '<a class="bg-success selectItem">';
						html += '<input type="radio" name="packageC" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
						// html += '</a>&nbsp';
						html +=	'</div>'; 
						that.$('#tab3').append(html);
						break;
					case '自由组合': 
						var classification = cardPackage.classification || '';
						switch(classification){
							case '全国流量包':
								html += '<div class="form-group">';
								// html += '<a class="bg-success selectItem">';
								html += '<input type="radio" name="packageD[data]" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
								// html += '</a>&nbsp';
								html +=	'</div>'; 
								that.$('#tab4_1').append(html);
								break;
							case '全国语音包':
								html += '<div class="form-group">';
								// html += '<a class="bg-success selectItem">';
								html += '<input type="radio" name="packageD[voice]" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
								// html += '</a>&nbsp';
								html +=	'</div>'; 
								that.$('#tab4_2').append(html);
								break;
							case '短/彩信包':
								html += '<div class="form-group">';
								// html += '<a class="bg-success selectItem">';
								html += '<input type="radio" name="packageD[sms]" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
								// html += '</a>&nbsp';
								html +=	'</div>'; 
								that.$('#tab4_3').append(html);
								break;
							case '来电显示':
								html += '<div class="form-group">';
								// html += '<a class="bg-success selectItem">';
								html += '<input type="radio" name="packageD[show]" value="'+ cardPackage._id +'" class="">&nbsp;' + cardPackage.name;
								// html += '</a>&nbsp';
								html +=	'</div>'; 
								that.$('#tab4_4').append(html);
								break;
						}
						break;
				}
			});
			//show first tab
			that.$('div.tabControl').first().removeClass('btn-default').addClass('btn-success');
			that.$('div.tab').hide();
			that.$('div.tab').first().show();
			that.trigger('ready');
		});
	},

	tabControl: function(evt){
		var target = evt.currentTarget;
		var index = $(target).index();
		//toggle tabs
		$(target).siblings('div.btn-success').removeClass('btn-success').addClass('btn-default');
		$(target).removeClass('btn-default').addClass('btn-success');
		//change tab content
		this.$('.tab').hide();
		$(this.$('.tab')[index]).show();
		//** remove the checked flag
		this.$('input[type=radio]').attr('checked',false);
		return false;
	},
	
	selectItem: function(evt){
		var target = evt.currentTarget;
		var radio = $(target).find('input[type=radio]');
		if(radio.attr('checked')){
			$(target).removeClass('bg-success').addClass('bg-info');
			radio.removeAttr('checked');
		}else{
			$(target).removeClass('bg-info').addClass('bg-success');
			radio.attr('checked',true);
		}
		return false;
	},

	submit: function(){
		var that = this;
		var products = [];
		var object = this.$('form').serializeJSON() || {};
		// console.log(object);
		var first = _.first(_.values(object));
		// console.log(first);
		if(typeof first == 'string'){
			var id = first;
			_.each(that.cardPackage,function(pkg){
				if(pkg._id == id){
					products.push(pkg);
				}
			});
		}else if(typeof first == 'object'){
			var ids = _.values(first);
			_.each(that.cardPackage, function(pkg){
				if(_.contains(ids,pkg._id)){
					products.push(pkg);
				}
			});
		}
		// console.log(products);
		that.done(products);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});
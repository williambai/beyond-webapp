var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    cardTpl = require('../templates/_entityOrderCard.tpl'),
	OrderCard = require('../models/OrderCard');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#cardForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.id = options.id;
		this.model = new OrderCard({_id: options.id});
		var page = $(cardTpl);
		var editTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .edit': 'editOrderCard',
		'click .back': 'cancel',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	editOrderCard: function(evt){
		this.router.navigate('order/card/edit/'+ this.id,{trigger: true});
		return false;
	},

	cancel: function(){
		this.router.navigate('order/card/index',{trigger: true, replace: true});
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
			this.router.navigate('order/card/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		if(status.code == 1){
			this.$('input[name="status[code]"]').attr('checked',true);
		}
		var itemsView = '<table class="table table-striped">';
		itemsView += '<thead><tr><td>名称</td><td>单价</td><td>数量</td><td>小计</td></tr></thead>';
		itemsView += '<tbody>';
		var items = this.model.get('items') || [];
		items.forEach(function(item){
			itemsView +='<tr>'+
						'<td>' + item.name + '</td>' +
						'<td>' + Number(item.price).toFixed(2) + '</td>' +
						'<td>' + item.quantity + '</td>' +
						'<td>' + Number(item.price * item.quantity).toFixed(2) + '</td>' +
						'</tr>';
		});
		itemsView += '</tbody></table>';
		this.$('#items').html(itemsView);
		return this;
	},
});
var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    orderTpl = require('../templates/_entityOrder.tpl');
var config = require('../conf');

Backbone.$ = $;

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/orders',	
	defaults: {
		customer: {},
		goods: {},
		customerInfo: {},
		bonus: {
			cash: 0,
			points: 0,
		},
		createBy: {},
		department: {},
	},
	validation: {
	},
});
//** 主视图
exports = module.exports = FormView.extend({

	el: '#orderForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Order({_id: options.id});
		var page = $(orderTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="department[name]"]': 'getDepartments',
		'click .department': 'selectDepartment',
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

	getDepartments: function(evt){
		this.$('#departments').empty();
		var that = this;
		var searchStr = this.$(evt.currentTarget).val() || '';
		if(searchStr.length >1){
			$.ajax({
				url: config.api.host + '/channel/departments?type=search&searchStr=' + searchStr,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data){
				data = data || [];
				var departmentsView = '<ul>';
				data.forEach(function(item){
					departmentsView += '<li class="department" id="'+ item._id +'" data="'+ item.name +'">' + item.path + '</li>';
				});
				departmentsView += '</ul>';
				that.$('#departments').html(departmentsView);
			});				
		}
		return false;
	},

	selectDepartment: function(evt){
		var id = this.$(evt.currentTarget).attr('id');
		var path = this.$(evt.currentTarget).text();
		var name = this.$(evt.currentTarget).attr('data');
		this.$('input[name="department[id]"]').val(id);
		this.$('input[name="department[path]"]').val(path);
		this.$('input[name="department[name]"]').val(name);
		this.$('#departments').empty();
		return false;
	},

	submit: function() {
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

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('order/index',{trigger: true, replace: true});
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
			this.router.navigate('order/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		// var itemsView = '<table class="table table-striped">';
		// itemsView += '<thead><tr><td>名称</td><td>单价</td><td>数量</td><td>小计</td></tr></thead>';
		// itemsView += '<tbody>';
		// var items = this.model.get('items') || [];
		// items.forEach(function(item){
		// 	itemsView +='<tr>'+
		// 				'<td>' + item.name + '</td>' +
		// 				'<td>' + Number(item.price).toFixed(2) + '</td>' +
		// 				'<td>' + item.quantity + '</td>' +
		// 				'<td>' + Number(item.price * item.quantity).toFixed(2) + '</td>' +
		// 				'</tr>';
		// });
		// itemsView += '</tbody></table>';
		// this.$('#items').html(itemsView);
		var status = this.model.get('status');
		this.$('input[name=status][value='+ status +']').attr('checked',true);
		var histories = this.model.get('histories');
		if(histories){
			histories = _.sortBy(histories,'respTime');
			var historyView = '';
			_.each(histories,function(history){
				historyView += '<p>' + history.respTime + '(' + history.respCode + ')[' + history.effectTime + ']: ' + history.respDesc + '</p>';
			});
			that.$('#history').html(historyView);
		}
		return this;
	},
});
var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    productTpl = require('../templates/_entityProductDirect.tpl'),
	ProductDirect = require('../models/ProductDirect');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#productForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductDirect({_id: options.id});
		var page = $(productTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup input[name="goods[nickname]"]': 'getGoods',
		'click li.list-group-item': 'selectGood',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
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
	
	getGoods: function(evt){
		this.$('#goods').empty();
		var that = this;
		var searchStr = this.$('input[name="goods[nickname]"]').val() || '';
		if(searchStr.length > 1){
			$.ajax({
				url: config.api.host + '/goods/entities?type=search&per=10&searchStr=' + searchStr,
				type: 'GET',
				fields: {
					withCredentials: true
				}
			}).done(function(data){
				data = data || [];
				var goods = '<ul class="list-group">';
				data.forEach(function(item){
					goods += '<li class="list-group-item">'+ 
							item.nickname  + '|' + 
							item.name + '|' +
							item.sourceId + '</li>';
				});
				goods += '</ul>';
				that.$('#goods').html(goods);
			});
		}
		return false;
	},

	selectGood: function(evt){
		var goods = $(evt.currentTarget).text().split('|');
		this.$('input[name="goods[nickname]"]').val(goods[0]);
		this.$('input[name="goods[name]"]').val(goods[1]);
		this.$('input[name="goods[sourceId]"]').val(goods[2]);
		this.$('#goods').empty();
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('form-group').removeClass('has-error');
		this.$('form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(!_.isEmpty(error)){
				errors.push(error);
				//set serrors
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
				return false;
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
		this.router.navigate('product/direct/index',{trigger: true, replace: true});
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
			this.router.navigate('product/direct/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var starttime = this.model.get('starttime');
		this.$('input[name=starttime]').val(starttime);
		var endtime = this.model.get('endtime');
		this.$('input[name=endtime]').val(endtime);
		var category = this.model.get('category');
		this.$('input[name=category][value='+ category +']').attr('checked',true);
		var status = this.model.get('status');
		this.$('input[name=status][value='+ status +']').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增产品');
		return this;
	},
});
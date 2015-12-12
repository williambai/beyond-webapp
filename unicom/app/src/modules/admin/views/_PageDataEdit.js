var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityPageData.tpl'),
	PageData = require('../models/PageData');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#dataForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new PageData({_id: options.id});
		var page = $(dataTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
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
		this.router.navigate('page/data/index',{trigger: true, replace: true});
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
			this.router.navigate('page/data/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		var category = this.model.get('category');
		this.$('input[name=category][value='+ category +']').attr('checked',true);
		var status = this.model.get('status');
		this.$('input[name=status][value='+ status +']').attr('checked',true);
		return this;
	},
});
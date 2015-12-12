var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityPageData.tpl'),
	PageData = require('../models/PageData');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#dataForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new PageData();
		var page = $(dataTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[name="goods[nickname]"]': 'getGoods',
		'click li.list-group-item': 'selectGood',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
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

	done: function(response){
		this.router.navigate('page/data/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});
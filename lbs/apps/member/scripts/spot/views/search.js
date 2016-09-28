define(['text!../templates/spot_search_item.tpl','text!../templates/spot_search_list.tpl','./city'],function(itemTpl, searchTpl, CityView){
	var Spot = Backbone.Model.extend({
		idAttribute: '_id',
		urlRoot: '/spots',
	});
	var Spots = Backbone.Collection.extend({
		url: '/spots',
		model: Spot,
		parse: function(response){
			this.per = response.per || 10;
			this.page = response.page || 0;
			this.total = response.total || 0;
			return response.collection;
		},
	});

	var ItemView = Backbone.View.extend({

		template: _.template(itemTpl),

		render: function(){
			this.el = this.template({model: this.model.toJSON()});
			return this;
		}
	});

	var PageView = Backbone.View.extend({
		el: '#content',
		template: _.template(searchTpl),

		initialize: function(options){
			this.context = options.context;
			this.collection = new Spots();
			this.collection.url = options.context.api_prefix + this.collection.url;
			this.collection.on('reset', this.renderCollection, this);
			this.collection.fetch({reset: true});
		},

		events: {
			'click #city': 'selectCity',
			'submit': 'submit',
		},

		selectCity: function(){
			// var cityView = new CityView({
			// 	context: this.context,
			// 	el: '#content',
			// });
			// this.context.trigger('changeView',cityView);
			// cityView.trigger('load');
			this.context.navigate('address/city',{trigger: true});
			return false;
		},

		search: function(){
			return false;
		},

		submit: function(){
			return false;
		},

		renderCollection: function(){
			var that = this;
			this.collection.each(function(model){
				var itemView = new ItemView({model:model});
				that.$('#list').append(itemView.render().el);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return PageView;	
});
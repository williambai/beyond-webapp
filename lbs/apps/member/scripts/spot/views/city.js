define(['text!../templates/city_item.tpl','text!../templates/city_list.tpl'],function(itemTpl, cityTpl){
	var Spot = Backbone.Model.extend({
		idAttribute: '_id',
		urlRoot: '/addresses/city',
	});
	var Spots = Backbone.Collection.extend({
		url: '/addresses/city',
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
		
		initialize: function(options){
			this.context = options.context;
		},

		render: function(){
			this.el = this.template({model: this.model.toJSON()});
			return this;
		}
	});

	var PageView = Backbone.View.extend({
		el: '#content',
		template: _.template(cityTpl),

		initialize: function(options){
			this.context = options.context;
			this.collection = new Spots();
			this.collection.url = options.context.api_prefix + this.collection.url;
			this.collection.on('reset', this.renderCollection, this);
			this.collection.fetch({reset: true});
		},

		events: {
			'click li': 'selectItem',
			'submit': 'submit',
		},

		selectItem: function(evt){
			var id = this.$(evt.currentTarget).attr('id');
			this.context.currentCity = id;
			this.context.navigate('spot/search',{trigger: true});
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
				var itemView = new ItemView({model:model,context: that.context});
				that.$('#list').append(itemView.render().el);
			});
		},

		render: function(){
			this.$el.html(this.template({currentCity: this.context.currentCity}));
			return this;
		}
	});
	return PageView;	
});
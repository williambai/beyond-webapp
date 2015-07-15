define(['text!templates/load-more.html',],function(loadMoreTemplate){
	var ScrollableView = Backbone.View.extend({
		templateLoadMore: _.template(loadMoreTemplate),

		page: 0,
		hasmore: true,
		collectionUrl: '',

		nextPage: function(){
			var that = this;
			if(this.hasmore){
            	if(this.$('.load-more').length == 0){
            		this.$el.append(this.templateLoadMore({loading: true}));
            	}
				++this.page;
				this.collection.url = this.collectionUrl + '?page=' + this.page;
				this.collection.fetch({
					success: function(collection, response){
						if(that.$('.load-more').length > 0){
							that.$('.load-more').remove();
						}
						if(collection.length == 0){
							that.hasmore = false;
						}else{
							that.onCollectonReset(collection);
							that.hasmore = true;
						}
					},
					error: function(collection,response){
						if(that.$('.load-more').length > 0){
							that.$('.load-more').remove();
						}
						that.hasmore = false;
					}
				});
			}else{
				if(that.$('.load-more').length == 0){
					that.$el.append(that.templateLoadMore({loading: false}));
				}
			}
		},

		scroll: function(){
			 viewH =this.$el.height(),//可见高度  
             contentH =this.$el.get(0).scrollHeight,//内容高度  
             scrollTop =this.$el.scrollTop();//滚动高度  
            if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            	this.nextPage();
            }
		},		
	});
	return ScrollableView;
});
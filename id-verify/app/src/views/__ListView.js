var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadMoreTemplate = require('../../assets/templates/__load-more.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	page: 0,
	hasmore: true,
	collectionUrl: '',

	nextPage: function(){
		var that = this;
		if(this.hasmore){
        	if(this.$('.load-more').length == 0){
        		this.$el.append(loadMoreTemplate({loading: true}));
        	}
			++this.page;
			if(this.collectionUrl.indexOf('?') == -1){
				this.collection.url = this.collectionUrl + '?page=' + this.page;
			}else{
				this.collection.url = this.collectionUrl + '&page=' + this.page;
			}
			this.collection.fetch({
				success: function(collection, response){
					if(that.$('.load-more').length > 0){
						that.$('.load-more').remove();
					}
					if(collection.length == 0){
						that.$el.append(loadMoreTemplate({loading: false}));
						that.hasmore = false;
					}else{
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
				that.$el.append(loadMoreTemplate({loading: false}));
			}
		}
	},

	prevPage: function(){
		var that = this;
		if(this.hasmore){
        	if(this.$('.load-more').length == 0){
        		this.$el.prepend(loadMoreTemplate({loading: true}));
        	}
			++this.page;
			this.collection.url = this.collectionUrl + '?page=' + this.page;
			this.collection.fetch({
				success: function(collection, response){
					if(that.$('.load-more').length > 0){
						that.$('.load-more').remove();
					}
					if(collection.length == 0){
						that.$el.prepend(loadMoreTemplate({loading: false}));
						that.hasmore = false;
					}else{
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
				that.$el.prepend(loadMoreTemplate({loading: false}));
			}
		}
	},

	scroll: function(){
		 var viewH =$(window).height();//当前window可见高度  
         var contentH =this.$el.get(0).scrollHeight;//内容高度  
         var scrollTop =$('#content').scrollTop();//可滚动容器的当前滚动高度  
        if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        	this.nextPage();
        }
	},	

	scrollUp: function(){
         var scrollTop =this.$el.scrollTop();//滚动高度  
         if(scrollTop <=100){
         	this.prevPage();
         }
	},


});
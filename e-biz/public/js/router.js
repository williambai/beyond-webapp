define(['views/Index','views/CategoryAdd','views/Categories','views/Product','views/Products','views/ProductEdit','models/Product','models/Category','models/ProductCollection','models/CategoryCollection'], function(IndexView,CategoryAddView,CategoriesView,ProductView,ProductsView,ProductEditView,Product,Category,ProductCollection,CategoryCollection){

	var BizRouter = Backbone.Router.extend({
		currentView : null,
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'': 'index',
			'index': 'index',
			'products/:id': 'products',
			'productEdit/:id': 'productEdit',
			'categoryAdd/:id': 'categoryAdd',
			'categories/:id': 'categories',
		},
		changeView: function(view){
			if(null != this.currentView){
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		index: function(){
			this.changeView(new IndexView());
		},
		products: function(id){
			var cid = (!id || id == 'root') ? '' : id;
			var productCollection = new ProductCollection();
			productCollection.url = '/products?cid=' + cid;;
			this.changeView(new ProductsView({collection: productCollection}));
			productCollection.fetch();
		},
		productEdit: function(id){
			var productModel;
			if(id == 'new'){
				productModel = new Product();
			}else{
				productModel = new Product({_id: id});				
			}
			this.changeView(new ProductEditView({model: productModel}));
		},

		categoryAdd: function(id){
			var pid = (!id || id == 'root') ? null : id;
			var categoryModel = new Category({
				parent_id: pid
			});
			this.changeView(new CategoryAddView({model: categoryModel}));
		},

		categories: function(id){
			var pid = (!id || id == 'root') ? '' : id;
			var categoryCollection = new CategoryCollection();
			categoryCollection.url = '/categories?pid=' + pid;
			this.changeView(new CategoriesView({collection: categoryCollection}));
			categoryCollection.fetch();
		}
	});

	return new BizRouter();
});
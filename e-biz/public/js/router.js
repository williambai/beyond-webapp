define(['views/Index','views/CategoryEdit','views/Categories','views/Product','views/Products','views/ProductEdit','views/ProductDetail','models/Product','models/Category','models/ProductCollection','models/CategoryCollection'], function(IndexView,CategoryEditView,CategoriesView,ProductView,ProductsView,ProductEditView,ProductDetailView,Product,Category,ProductCollection,CategoryCollection){

	var BizRouter = Backbone.Router.extend({
		currentView : null,
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'': 'index',
			'index': 'index',
			'products(/:id)': 'products',
			'product/add(/:cid)': 'productAdd',
			'product/edit/:id': 'productEdit',
			'product/view/:id': 'productView',

			'categories(/:id)': 'categories',
			'category/add(/:pid)': 'categoryAdd',
			'category/edit/:id': 'categoryEdit',
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

		/** product related */
		products: function(id){
			var cid = id || '';
			var productCollection = new ProductCollection();
			productCollection.url = '/products?cid=' + cid;;
			this.changeView(new ProductsView({collection: productCollection}));
			productCollection.fetch();
		},
		productAdd: function(categoryId){
			var cid = categoryId || '';
			var productModel = new Product({
				main_cat_id: cid,
			});
			this.changeView(new ProductEditView({model: productModel}));
		},
		productEdit: function(id){
			var product = new Product();				
			product.url = '/products/' + id;
			this.changeView(new ProductEditView({model: product}));
			product.fetch();			
		},

		productView: function(id){
			var product = new Product();				
			product.url = '/products/' + id;
			this.changeView(new ProductDetailView({model: product}));
			product.fetch();			
		},

		/** category related */
		categories: function(id){
			var pid = id || '';
			var categoryCollection = new CategoryCollection();
			categoryCollection.url = '/categories?pid=' + pid;
			this.changeView(new CategoriesView({collection: categoryCollection}));
			categoryCollection.fetch();
		},

		categoryAdd: function(parentId){
			var pid = parentId || '';
			var categoryModel = new Category({
				parent_id: pid
			});
			this.changeView(new CategoryEditView({model: categoryModel}));
		},

		categoryEdit: function(id){
			var category = new Category();
			category.url = '/categories/' + id;
			this.changeView(new CategoryEditView({model: category}));
			category.fetch();
		},
	});

	return new BizRouter();
});
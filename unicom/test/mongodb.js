var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var config = {
		db: require('../config/db')
	};		

//import the models
var models = {
		PlatformFeature: require('../models/PlatformFeature')(mongoose),
		PlatformRole: require('../models/PlatformRole')(mongoose),
		ChannelCategory: require('../models/ChannelCategory')(mongoose),
		ChannelDepartment: require('../models/ChannelDepartment')(mongoose),
		ChannelGrid: require('../models/ChannelGrid')(mongoose),
		ProductCard: require('../models/ProductCard')(mongoose),
		OrderCard: require('../models/OrderCard')(mongoose),
		WoRevenue: require('../models/WoRevenue')(mongoose),
	};

mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

/**
 * 准备数据
 * 
 */


var dropCollections = function(done) {
	async.series(
		[
			function(callback) {
				models.PlatformFeature.remove(callback);
			},
			function(callback) {
				models.PlatformRole.remove(callback);
			},
			function(callback) {
				models.ChannelCategory.remove(callback);
			},
			function(callback) {
				models.ChannelDepartment.remove(callback);
			},
			function(callback) {
				models.ChannelGrid.remove(callback);
			},
			function(callback) {
				models.ChannelGrid.remove(callback);
			},
			function(callback) {
				models.ProductCard.remove(callback);
			},
			function(callback) {
				models.OrderCard.remove(callback);
			},
			function(callback) {
				models.WoRevenue.remove(callback);
			},
		],
		function(err, result) {
			if (err) return done(err);
			done(null, result);
		}
	);
};

/**
 * 
 * create PlatformFeatures
 * 
 */
var upsertPlatformFeatures = function(done) {
	var features = require('./fixtures/platform.feature');
	async.eachSeries(features, function(feature, callback) {
		models.PlatformFeature.create(feature, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create PlatformRoles
 * 
 */
var upsertPlatformRoles = function(done) {
	var roles = require('./fixtures/platform.role');
	async.eachSeries(roles, function(role, callback) {
		models.PlatformRole.create(role, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create ChannelCategories
 * 
 */
var upsertChannelCategories = function(done) {
	var categories = require('./fixtures/channel.category');
	async.eachSeries(categories, function(category, callback) {
		models.ChannelCategory.create(category, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create ChannelDepartments
 * 
 */
var upsertChannelDepartments = function(done) {
	var departments = require('./fixtures/channel.department');
	async.eachSeries(departments, function(department, callback) {
		models.ChannelDepartment.create(department, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create ChannelGrids
 * 
 */
var upsertChannelGrids = function(done) {
	var grids = require('./fixtures/channel.grid');
	async.eachSeries(grids, function(grid, callback) {
		models.ChannelGrid.create(grid, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};
/**
 * 
 * create ProductCards
 * 
 */
var upsertProductCards = function(done) {
	var cards = require('./fixtures/product.card');
	async.eachSeries(cards, function(card, callback) {
		models.ProductCard.create(card, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create OrderCards
 * 
 */
var upsertOrderCards = function(done) {
	var orders = require('./fixtures/order.card');
	async.eachSeries(orders, function(order, callback) {
		models.OrderCard.create(order, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create WoRevenues
 * 
 */
var upsertWoRevenues = function(done) {
	var revenues = require('./fixtures/wo.revenue');
	async.eachSeries(revenues, function(revenue, callback) {
		models.WoRevenue.create(revenue, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * process workflow
 * 
 */

async.series(
	[
		dropCollections,
		upsertPlatformFeatures,
		upsertPlatformRoles,
		upsertChannelCategories,
		upsertChannelDepartments,
		upsertChannelGrids,
		upsertProductCards,
		upsertOrderCards,
		upsertWoRevenues,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);

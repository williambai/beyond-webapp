<div class="sidebar sidebar-left">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			<a href="#" onclick="window.location.reload();return false;">创富计划--后台管理</a>
		</div>
		<div class="scrollable-content" id="menu">
			<div class="list-group">
				<a class="list-group-item active" href="#index"> <i class="fa fa-users fa-fw"></i>
					&nbsp;首页
					<span class="pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#order/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;订单管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#order/card/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;卡号订单
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#role/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;角色设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#account/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;用户管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<!-- <a class="list-group-item" href="#channel/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;渠道管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#customer/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;客户管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#goods/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;物料管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#card/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;卡号管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a> -->
				<!-- <a class="list-group-item" href="#revenue/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;金币管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#order/phone/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;合约机订单
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#order/product/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;商品兑换订单
					<i class="fa fa-chevron-right pull-right"></i>
				</a> -->
			</div>
			<div class="list-group">
				<!-- 
				<a class="list-group-item" href="#page/banner/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;首页轮播配置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#promote/product/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;分类数据配置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#promote/media/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;图片管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#department/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;组织设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#grid/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;网格设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#channel/category/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;渠道类型设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#goods/bonus/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;产品奖励配置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;金币兑换配置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#user/feedback/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;用户反馈
					<i class="fa fa-chevron-right pull-right"></i>
				</a> -->
				<a class="list-group-item" href="#profile/me">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;我的资料
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<!-- <a class="list-group-item" href="#logout">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;退出
					<i class="fa fa-chevron-right pull-right"></i>
				</a> -->
			</div>
			<div id="projectlist"></div>
			<br/>
			<br/>
			<br/>
		</div>
	</div>
</div>

<div class="sidebar sidebar-right">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			待办事宜
			<a href="#friends" class="pull-right">
				<i class="fa fa-search"></i>
				管理
			</a>
		</div>
		<div class="scrollable-content">
			<div id="chat" class="list-group"></div>
		</div>
	</div>
</div>
<div class="app">
	<div class="navbar navbar-app navbar-absolute-top">
		<div class="navbar-brand navbar-brand-center">贵州联通创富计划</div>
		<div class="btn-group pull-left">
			<div class="btn sidebar-toggle" id="left-sidebar-toggle">
				<i class="fa fa-bars fa-lg"></i>
				&nbsp;菜单
			</div>
		</div>
		<div class="btn-group pull-right">
			<div class="btn" id="right-sidebar-toggle">
				<i class="fa fa-comment fa-lg"></i>
				&nbsp;提醒
			</div>
		</div>
	</div>
	<div class="navbar navbar-app navbar-absolute-top" id="deviceready" style="display:none;">
		<div class="navbar-brand-center">
			<h4 class="bg-warning">网络不通</h4>
		</div>
	</div>
	<div class="app-body">
		<div class="app-content">
			<div class="scrollable">
				<div id="content" class="scrollable-content section"></div>
			</div>
		</div>
	</div>
</div>
<div class="sidebar sidebar-left">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			<a href="#" onclick="window.location.reload();return false;">创富计划--系统管理员</a>
			&nbsp;
		</div>
		<div class="scrollable-content">
			<div class="list-group">
				<a class="list-group-item active" href="#index"> <i class="fa fa-users fa-fw"></i>
					&nbsp;首页
					<span class="pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#platform/app/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;应用设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#feature/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;功能设置
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#role/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;角色设置
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
				<a class="list-group-item" href="#monitor/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;运营监控
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#database/index">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;数据维护
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#logout">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;退出
					<i class="fa fa-chevron-right pull-right"></i>
				</a>

			</div>
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
		<div class="navbar-brand navbar-brand-center">系统管理员</div>
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
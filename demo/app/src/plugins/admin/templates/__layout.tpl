<div class="sidebar sidebar-left">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			<a href="#" onclick="window.location.reload();return false;">工作社交网--管理</a>
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
				<a class="list-group-item" href="#activity/me">
					<i class="fa fa-users fa-fw"></i>
					&nbsp;组织管理
					<span class="status-unread pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#project/me">
					<i class="fa fa-home fa-fw"></i>
					&nbsp;应用管理
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#profile/me">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;我的资料
					<i class="fa fa-chevron-right pull-right"></i>
				</a>

			</div>
			<br/>
			<br/>
			<br/>
		</div>
	</div>
</div>

<!-- <div class="sidebar sidebar-right">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			我的好友
			<a href="#friends" class="pull-right">
				<i class="fa fa-search"></i>
				管理
			</a>
		</div>
		<div class="scrollable-content">
			<div id="chat" class="list-group"></div>
		</div>
	</div>
</div> -->
<div class="app">
	<div class="navbar navbar-app navbar-absolute-top">
		<div class="navbar-brand navbar-brand-center">工作社交网--管理</div>
		<div class="btn-group pull-left">
			<div class="btn sidebar-toggle" id="left-sidebar-toggle">
				<i class="fa fa-bars fa-lg"></i>
				&nbsp;菜单
			</div>
		</div>
		<!-- <div class="btn-group pull-right">
			<div class="btn" id="right-sidebar-toggle">
				<span class="badge chat-total-unread"></span>
				<i class="fa fa-comment fa-lg"></i>
				&nbsp;通讯录
			</div>
		</div> -->
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
<div class="sidebar sidebar-left">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			<a href="#" onclick="window.location.reload();return false;">我的工作社交网</a>
			&nbsp;
			<a href="#project/add" class="pull-right"> <i class="fa fa-plus-square"></i>
				项目
			</a>
		</div>
		<div class="scrollable-content">
			<div class="list-group">
				<a class="list-group-item active" href="#index"> <i class="fa fa-users fa-fw"></i>
					&nbsp;首页
					<span class="status-unread pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#activity/me">
					<i class="fa fa-users fa-fw"></i>
					&nbsp;同事圈
					<span class="status-unread pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#project/me">
					<i class="fa fa-home fa-fw"></i>
					&nbsp;我的项目
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#message/me">
					<i class="fa fa-users fa-fw"></i>
					&nbsp;我的私信
					<span class="message-unread pull-right">
						<i class="fa fa-chevron-right"></i>
					</span>
				</a>
				<a class="list-group-item" href="#space/me">
					<i class="fa fa-home fa-fw"></i>
					&nbsp;我的发表
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#notify/me">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;通知提醒
					<i class="fa fa-chevron-right pull-right"></i>
				</a>
				<a class="list-group-item" href="#profile/me">
					<i class="fa fa-meh-o fa-fw"></i>
					&nbsp;我的资料
					<i class="fa fa-chevron-right pull-right"></i>
				</a>

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
			我的好友
			<a href="#friends/me" class="pull-right">
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
		<div class="navbar-brand navbar-brand-center">我的社交网络</div>
		<div class="btn-group pull-left">
			<div class="btn sidebar-toggle" id="left-sidebar-toggle">
				<i class="fa fa-bars fa-lg"></i>
				&nbsp;菜单
			</div>
		</div>
		<div class="btn-group pull-right">
			<div class="btn" id="right-sidebar-toggle">
				<span class="badge chat-total-unread"></span>
				<i class="fa fa-comment fa-lg"></i>
				&nbsp;通讯录
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
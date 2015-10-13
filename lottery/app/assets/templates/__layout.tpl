<div class="sidebar sidebar-left">
	<div class="scrollable" style="padding-top:70px;">
		<div class="scrollable-header app-name">
			<a href="#" onclick="window.location.reload();return false;">祝您好运计划</a>
		</div>
		<div class="scrollable-content">
			<div class="list-group">
				<% if(account.logined == 0){ %>
				<a class="list-group-item active" href="#login"><i class="fa fa-home fa-fw"></i>&nbsp;登录<i class="fa fa-chevron-right pull-right"></i></a>
				<% }else if(account.logined == 1){ %>
				<a class="list-group-item active" href="#login/need"><i class="fa fa-home fa-fw"></i>&nbsp;完善信息<i class="fa fa-chevron-right pull-right"></i></a>
				<% }else{%>
				<a class="list-group-item active" href="#index"><i class="fa fa-home fa-fw"></i>&nbsp;主页<i class="fa fa-chevron-right pull-right"></i></a>
				<% if(account.roles.user){ %>
				<a class="list-group-item" href="#lottery/3d/me"><i class="fa fa-users fa-fw"></i>&nbsp;3D福彩<span class="message-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<a class="list-group-item" href="#lottery/ssq/me"><i class="fa fa-users fa-fw"></i>&nbsp;双色球<span class="message-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<a class="list-group-item" href="#lottery/qlc/me"><i class="fa fa-users fa-fw"></i>&nbsp;七乐彩<span class="message-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<% } %>
				<% } %>
			</div>
			<div class="list-group">
				<% if(account.logined == 0){ %>
				
				<% }else if(account.logined == 1){ %>
				<a class="list-group-item" href="#logout"><i class="fa fa-meh-o fa-fw"></i>&nbsp;退出系统<i class="fa fa-chevron-right pull-right"></i></a>
				<% }else{ %>
				<% if(account.roles.agent || account.roles.app){ %>
				<a class="list-group-item" href="#order/index"><i class="fa fa-users fa-fw"></i>&nbsp;订单管理<span class="status-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<% } %>
				<% if(account.roles.agent || account.roles.app || account.roles.user){ %>
				<a class="list-group-item" href="#record/index"><i class="fa fa-users fa-fw"></i>&nbsp;出票管理<span class="status-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<% } %>
				<% if(account.roles.admin){ %>
				<a class="list-group-item" href="#user/index"><i class="fa fa-users fa-fw"></i>&nbsp;用户管理<span class="status-unread pull-right"><i class="fa fa-chevron-right"></i></span></a>
				<% } %>
				<a class="list-group-item" href="#profile"><i class="fa fa-meh-o fa-fw"></i>&nbsp;我的资料<i class="fa fa-chevron-right pull-right"></i></a>
				<% } %>
			</div>
		</div>
	</div>
</div>

<div class="sidebar sidebar-right">
<div class="scrollable" style="padding-top:70px;">
	<div class="scrollable-header app-name">
		我的好友<a href="#contacts/me" class="pull-right"><i class="fa fa-search"></i>管理</a>
	</div>
  <div class="scrollable-content">
      <div id="chat" class="list-group">
      </div>
  </div>
</div>
</div>
 <div class="app">
	 <div class="navbar navbar-app navbar-absolute-top">
	 	<div class="navbar-brand navbar-brand-center">
	 		主页
	 	</div>
	 	<div class="btn-group pull-left">
	 		<div class="btn sidebar-toggle" id="left-sidebar-toggle">
	 			<i class="fa fa-bars fa-lg"></i>&nbsp;菜单
	 		</div>
	 	</div>
	 	<div class="btn-group pull-right">
	 		<div class="btn" id="right-sidebar-toggle">
		 		<span class="badge chat-total-unread"></span><i class="fa fa-comment fa-lg"></i>&nbsp;通讯录
		 	</div>
	 	</div>
	 </div>
	 <div class="app-body">
	 	<div class="app-content">
	 		<div class="scrollable">
	 			<div id="content" class="scrollable-content section">
	 			</div>
	 		</div>
	 	</div>
	 </div>
  </div>
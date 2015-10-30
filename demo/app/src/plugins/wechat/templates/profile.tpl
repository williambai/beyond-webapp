<div class="media">
	<div class="pull-left">
		<img class="media-object" src="<%= account.avatar %>" width="120px" height="160px">
	</div>
	<div class="media-body">
		<h2 class="media-heading"><%= account.username %></h2>
		<h4><%= account.realname %></h4>
	</div>
</div>
<p class="clearfix"></p>
<hr>
<h2>我的自传</h2>
<%if(account.biography.length > 0){ %>
	<p><%= account.biography %></p>
<%}else{ %>
	<p class="small">比较懒，没写自我介绍</p>
<% } %>
<p>&nbsp;</p>
<div class="button-layer">
	<a href="#" class="btn btn-block btn-danger logout">退出，绑定新账号</a>
</div>
<p>&nbsp;</p>
<p>&nbsp;</p>
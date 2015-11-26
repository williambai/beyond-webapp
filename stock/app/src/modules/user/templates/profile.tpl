<% if(me){ %>
<div class="editor-layer">
	<a class="btn btn-primary pull-right editor-control" href="#profile/me/edit">编辑</a>
	<p>&nbsp;</p>
</div>
<% } %>
<hr>

<div class="media">
	<div class="pull-left">
		<img class="media-object" src="<%= account.avatar %>" width="120px" height="160px">
	</div>
	<div class="media-body">
		<h2 class="media-heading"><%= account.username %></h2>
		<h4>&lt;<%= account.email %>&gt;</h4>
		<% if(!me){ %>
		<a href="#space/<%= account._id %>">私信TA</a>
		<% } %>
	</div>
</div>
<p class="clearfix"></p>
<hr>
<h2>我的自传</h2>
<%if(account.biography && account.biography.length > 0){ %>
	<p><%= account.biography %></p>
<%}else{ %>
	<p class="small">比较懒，没写自我介绍</p>
<% } %>
<hr>
<% if(!me){ %>
<h2>动态</h2>
<hr>
<div class="status-list"></div>
<a class="pull-right" href="#space/<%= account._id %>">更多...</a>
<p>&nbsp;</p>

<h2>好友</h2>
<hr>
<div class="friend-list"></div>
<% } %>

<% if(me){ %>
<hr>
<div class="button-layer">
	<a href="#" class="btn btn-block btn-danger logout">退出</a>
</div>
<p>&nbsp;</p>
<p>&nbsp;</p>
<% } %>
<!-- <h2>状态更新记录</h2>
<form>
<fieldset>
	<legend>发表评论</legend>
	<input type="text" name="status" />
	<input type="submit" value="添加" />
</fieldset>
</form>
<hr>
-->
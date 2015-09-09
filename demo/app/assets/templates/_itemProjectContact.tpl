<hr>
<div class="media">
	<div class="pull-left">
		<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;">
	</div>
<% if(project.isOwner){ %>	
	<div class="actionArea pull-right">
		<% if(addButton){ %>
				<button class="addbutton">添加为成员</button>
		<% } %>

		<% if(removeButton){ %>
				<button class="removebutton">移除成员</button>
		<% } %>
	</div>
<% } %>
	<div class="media-body">
		<div class="media-heading"><h1><%= model.username %></h1></div>
			<p>
			<% if(model.accountId){ %>	
				<a href="#profile/<%= model.accountId %>">个人资料</a> &nbsp;
				<a href="#status/<%= model.accountId %>">看一看</a>
			<% }else{ %>
				<a href="#profile/<%= model._id %>">个人资料</a> &nbsp;
				<a href="#status/<%= model._id %>">看一看</a>
			<% } %>	
			</p>
	</div>
</div>

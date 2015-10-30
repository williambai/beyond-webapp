<hr>
<div class="media">
	<div class="pull-left">
		<a href="#profile/<%= model.accountId %>">
			<img class="media-object" src="<%= model.avatar %>" width="64px;" height="64px;">
		</a>
	</div>
	<div class="actionArea pull-right">
		<button class="removebutton">移除</button>
	</div>
	<div class="media-body">
		<div class="media-heading"><h1><%= model.username %></h1></div>
			<p>
			<% if(model.accountId){ %>	
				<a href="#space/<%= model.accountId %>">看一看</a>
			<% }else{ %>
				<a href="#profile/<%= model._id %>">个人资料</a> &nbsp;
				<a href="#space/<%= model._id %>">看一看</a>
			<% } %>	
			</p>
	</div>
</div>





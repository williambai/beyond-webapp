<a class="list-group-item media" href="#chat/<%= model.fid %>">
	<div class="pull-left">
		<% if(model.avatar && model.avatar.length > 3){ %>
			<img src="<%= model.avatar %>" width="36px;">
		<% }else{ %>
			<i class="fa fa-user chat-user-avatar"></i>
		<% } %>
	</div>
	<div class="pull-right">
		<span class="badge message-unread"></span>		
	</div>
	<div class="media-body">
		<h5 class="media-heading"><%= model.username %></h5>
		<small>
			<span class="label label-default">
				<i>离线</i>
			</span>
		</small>
	</div>
</a>
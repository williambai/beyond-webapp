<hr>
<div class="media" id="<%= model._id %>">
	<% if(model.status && model.status.code == 0){ %>
	<div class="actionArea pull-right">
		<% model.actions = model.actions || [] %>
		<% model.actions.forEach(function(action){ %>
		<button name="<%= action.name %>"><%= action.label %></button>
		<% });%>
	</div>
	<% } %>
	<div class="media-body">
		<div class="media-heading">
			<h4><%= model.content.subject %></h4>
		</div>
		<p><%= model.content.body %></p>
	</div>
</div>

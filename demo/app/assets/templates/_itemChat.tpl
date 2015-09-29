<!-- use chat.less -->
<% if(from != 'me'){ %>
<div class="sender">
	<img class="avatar" src="<%= createby.avatar %>">
	<div class="left-triangle"></div>
	<div class="chat-content">
		<p class="left"><span><%= content %></span></p>
	</div>	
</div>
<% }else{ %>
<div class="receiver">
	<img class="avatar" src="<%= createby.avatar %>">
	<div class="right-triangle"></div>
	<div class="chat-content">
		<p class="right"><%= content %></p>
	</div>
</div>
<% } %>

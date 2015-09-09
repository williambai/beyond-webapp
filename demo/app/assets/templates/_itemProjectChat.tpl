<!-- use chat.less -->
<% if(message.from != 'me'){ %>
<div class="sender">
	<img class="avatar" src="<%= message.avatar %>">
	<div class="left-triangle"></div>
	<div class="chat-content">
		<p class="left"><span><%= message.content %></span></p>
	</div>	
</div>
<% }else{ %>
<div class="receiver">
	<img class="avatar" src="<%= message.avatar %>">
	<div class="right-triangle"></div>
	<div class="chat-content">
		<p class="right"><%= message.content %></p>
	</div>
</div>
<% } %>

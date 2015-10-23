<!-- use chat.less -->
<% if(message.from != 'me'){ %>
<div class="sender">
	<% if(message.createby){ %>
	<img class="avatar" src="<%= message.createby.avatar %>">
	<% }else{ %>
	<img class="avatar" src="">
	<% } %>
	<div class="left-triangle"></div>
	<div class="chat-content">
		<p class="left"><span><%= message.content %></span></p>
	</div>	
</div>
<% }else{ %>
<div class="receiver">
	<% if(message.createby){ %>
	<img class="avatar" src="<%= message.createby.avatar %>">
	<% }else{ %>
	<img class="avatar" src="">
	<% } %>
	<div class="right-triangle"></div>
	<div class="chat-content">
		<p class="right"><%= message.content %></p>
	</div>
</div>
<% } %>

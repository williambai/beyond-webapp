<h4 class="pull-right danger">
	校验结果：
	<% if(person.credential){ %>
		一致
	<% }else{ %>
		不一致
	<% } %>
</h4>
<p>
	<span>姓名：</span><%= person.card_name%><span><br>身份证号：</span><%= person.card_id %><br>
</p>

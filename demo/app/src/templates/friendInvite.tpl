<h4>邀请您的同事或好友加入，TA将收到您的邀请邮件。</h4>
<hr>
<form>
	 <div id="error"></div>
	<% for(var i=0;i<5;i++){ %>
	<div class="form-group">
		<input type="text" name="email" class="form-control" placeholder="好友的邮箱地址">
		<span class="help-block"></span>
	</div>
	<% } %>
	<div id="add-line">
		<a type="btn" class="pull-right">邀请更多，还需要增加...</a>
	</div>
	<br>
	<div class="form-group">
		<button class="btn btn-primary btn-block">邀请</button>
	</div>
</form>
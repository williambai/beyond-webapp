<h4>邀请您的同事或好友加入，TA将收到您的邀请邮件。</h4>
<hr>
<form>
	<% for(var i=0;i<5;i++){ %>
	<div class="form-group">
		<div class="input-group">
			<input type="text" name="email" class="form-control" placeholder="好友的邮箱地址" />
			<span class="input-group-addon"></span>
		</div>
	</div>
	<% } %>
	<div class="form-group" id="add-line">
		<a type="btn" class="pull-right">邀请更多，还需要增加...</a>
		<br></div>
	<div class="form-group">
		<button class="btn btn-primary btn-block">邀请</button>
	</div>
</form>
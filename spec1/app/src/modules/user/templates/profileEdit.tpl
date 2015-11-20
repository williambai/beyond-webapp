<div class="form-group">
	<img src="<%= avatar %>
	" width="120px" height="160px">
	<br>
	<input type="file" name="avatar"/>
</div>

<div id="accountForm">
	<div id="error"></div>
	<form>
		<div class="form-group">
			<label for="username">姓名：</label>
			<input type="text" name="username" value="<%= username %>" class="form-control"/></div>
		<div class="form-group">
			<label for="email">电子邮件：</label>
			<input type="text" name="email" value="<%= email %>" class="form-control" disabled/></div>
		<div class="form-group">
			<label for="password">密码：</label>
			<input type="password" name="password" value="" class="form-control"/>
		</div>
		<div class="form-group">
			<label for="password">密码(再次)：</label>
			<input type="password" name="cpassword" value="" class="form-control"/>
		</div>
		<div class="form-group">
			<label for="biography">自传：</label>
			<textarea name="biography" rows="3" class="form-control"></textarea>
		</div>
		<div class="form-group">
			<input type="submit" class="btn btn-block btn-primary"/>
		</div>
	</form>
</div>
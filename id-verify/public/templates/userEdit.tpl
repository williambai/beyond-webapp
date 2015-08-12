<form class="">
	<div class="form-group">
		<label>用户名：</label>
		<div class="">
			<input type="username" class="form-control" name="username" value="<%= user.username %>" placeholder="请输入真实姓名"/>
		</div>
	</div>
	<div class="form-group">
		<label>登录账号(email)：</label>
		<div class="">
			<input type="email" class="form-control" name="email" value="<%= user.email %>" placeholder="请使用电子邮件地址" <% if(user._id){ %> disabled <% } %>/>
		</div>
	</div>
	<div class="form-group">
		<label>登录密码：</label>
		<div class="">
			<input type="password" class="form-control" name="password" placeholder="请输入六位以上数字或字母"/>
		</div>
	</div>
	<div class="form-group">
		<label>登录密码(再次)：</label>
		<div class="">
			<input type="password" class="form-control" name="password2" placeholder="请输入六位以上数字或字母"/>
		</div>
	</div>
	<div class="form-group">
		<label>用户类型：</label>
		<div class="">
			<input type="checkbox" name="roles" value="app" <% if(user.roles.app){ %>checked <% } %>/> 应用接口
			<input type="checkbox" name="roles" value="user" <% if(user.roles.user){ %>checked <% } %>/> 业务员
			<% if(account.roles.admin){ %>
			<input type="checkbox" name="roles" value="agent" <% if(user.roles.agent){ %>checked <% } %>/> 代理商
			<input type="checkbox" name="roles" value="admin" <% if(user.roles.admin){ %>checked <% } %>/> 管理员
			<% } %>
		</div>
	</div>
	<div class="form-group">
		<label>账户类型：</label>
		<div class="">
			<input type="radio" name="stage" value="test" <% if(user.business.stage == 'test'){ %>checked <% } %>/> 试用
			<input type="radio" name="stage" value="dev" <% if(user.business.stage == 'dev'){ %>checked <% } %>/> 开发
			<input type="radio" name="stage" value="prod" <% if(user.business.stage == 'prod'){ %>checked <% } %>/> 正式
		</div>
	</div>

	<div class="form-group">
		<label>每日最高使用次数(-1不限制)：</label>
		<div class="">
			<input type="number" class="form-control" name="times" value="<%= user.business.times %>"/>
		</div>
	</div>

	<div class="form-group">
		<label>有效期：</label>
		<div class="">
			<input type="date" class="form-control" name="expired" value="<%= user.business.expired %>" placeholder=""/>
		</div>
	</div>

	<div class="form-group">
		<label>账户余额：</label>
		<div class="">
			<input type="number" class="form-control" name="balance" value="<%= user.balance %>" <% if(user._id){ %> disabled <% } %>/>
		</div>
	</div>

	<div class="form-group">
		<label>账号是否可用：</label>
		<div class="">
			<input type="radio" name="enable" value="true" <% if(user.enable){ %>checked <% } %>/> 有效
			<input type="radio" name="enable" value="false" <% if(!user.enable){ %>checked <% } %>/> 禁用
		</div>
	</div>

	<div class="form-group">
		<input type="submit" class="btn btn-primary btn-block" value="提交">
	</div>
</form>
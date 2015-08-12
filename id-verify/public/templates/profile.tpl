<form class="">
	<div class="form-group">
		<label>用户名：</label>
		<div class="">
			<input type="username" class="form-control" name="username" value="<%= user.username %>" disabled/>
		</div>
	</div>
	<div class="form-group">
		<label>登录账号(email)：</label>
		<div class="">
			<input type="email" class="form-control" name="email" value="<%= user.email %>" disabled/>
		</div>
	</div>
	<div class="form-group">
		<label>用户类型：</label>
		<div class="">
			<input type="checkbox" name="roles" value="app" <% if(user.roles.app){ %>checked <% } %> disabled/> 应用接口
			<input type="checkbox" name="roles" value="user" <% if(user.roles.user){ %>checked <% } %> disabled/> 业务员
			<input type="checkbox" name="roles" value="agent" <% if(user.roles.agent){ %>checked <% } %> disabled/> 代理商
			<input type="checkbox" name="roles" value="admin" <% if(user.roles.admin){ %>checked <% } %> disabled/> 管理员
		</div>
	</div>
	<div class="form-group">
		<label>账户类型：</label>
		<div class="">
			<input type="radio" name="stage" value="test" <% if(user.business.stage == 'test'){ %>checked <% } %> disabled/> 试用
			<input type="radio" name="stage" value="dev" <% if(user.business.stage == 'dev'){ %>checked <% } %> disabled/> 开发
			<input type="radio" name="stage" value="prod" <% if(user.business.stage == 'prod'){ %>checked <% } %> disabled/> 正式
		</div>
	</div>

	<div class="form-group">
		<label>每日最高使用次数(-1不限制)：</label>
		<div class="">
			<input type="number" class="form-control" name="times" value="<%= user.business.times %>" disabled/>
		</div>
	</div>

	<div class="form-group">
		<label>有效期：</label>
		<div class="">
			<input type="date" class="form-control" name="expired" value="<%= user.business.expired %>" disabled/>
		</div>
	</div>

	<div class="form-group">
		<label>账户余额：</label>
		<div class="">
			<input type="number" class="form-control" name="balance" value="<%= user.balance %>" disabled/>
		</div>
	</div>

	<div class="form-group">
		<label>账号是否可用：</label>
		<div class="">
			<input type="radio" name="enable" value="true" <% if(user.enable){ %>checked <% } %> disabled/> 有效
			<input type="radio" name="enable" value="false" <% if(!user.enable){ %>checked <% } %> disabled/> 禁用
		</div>
	</div>
</form>
<button class="btn btn-danger btn-block logout">退出</button>
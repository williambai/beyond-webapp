<form class="">
	<div class="form-group">
		<label>用户名：</label>
		<div class="">
			<input type="text" class="form-control" name="username" value="<%= user.username %>" placeholder="请输入真实姓名"/>
		</div>
	</div>
	<div class="form-group">
		<label>登录账号(邮箱或手机号)：</label>
		<div class="">
			<input type="text" class="form-control" name="email" value="<%= user.email %>" placeholder="请使用电子邮件地址" <% if(user._id){ %> disabled <% } %>/>
		</div>
	</div>
	<div class="form-group">
		<label>身份证号码：</label>
		<div class="">
			<input type="text" class="form-control" name="cardid" value="<%= user.cardid %>" placeholder="请输入身份证号码"/>
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
<% if(user.roles.agent || user.roles.admin || !user._id){ %>
	<div class="form-group">
		<label>用户类型：</label>
		<div class="">
			<input type="checkbox" name="roles-app" value="app" <% if(user.roles.app){ %>checked <% } %>/> 应用接口
			<input type="checkbox" name="roles-user" value="user" <% if(user.roles.user){ %>checked <% } %>/> 业务员
			<% if(account.roles.admin){ %>
			<input type="checkbox" name="roles-agent" value="agent" <% if(user.roles.agent){ %>checked <% } %>/> 代理商
			<input type="checkbox" name="roles-admin" value="admin" <% if(user.roles.admin){ %>checked <% } %>/> 管理员
			<% } %>
		</div>
	</div>
	<div class="form-group">
		<label>账户类型：</label>
		<div class="">
			<input type="radio" name="business-stage" value="test" <% if(user.business.stage == 'test'){ %>checked <% } %>/> 试用
			<input type="radio" name="business-stage" value="dev" <% if(user.business.stage == 'dev'){ %>checked <% } %>/> 开发
			<input type="radio" name="business-stage" value="prod" <% if(user.business.stage == 'prod'){ %>checked <% } %>/> 正式
		</div>
	</div>
	<div class="form-group">
		<label>业务类型：</label>
		<hr>
		<div class="">
			<input type="checkbox" name="business-types-verify" value="verify" <% if(user.business.types && user.business.types.verify){ %>checked <% } %>/> 校验（检验身份证合法性）
		</div>
	</div>
	<div class="form-group">
		<div class="">
			<input type="checkbox" name="business-types-base" value="base" <% if(user.business.types && user.business.types.base){ %>checked <% } %>/> 基本信息（获取居民身份基本信息）
		</div>
	</div>
	<div class="form-group">
		<div class="">
			<input type="checkbox" name="business-types-whole" value="whole" <% if(user.business.types && user.business.types.whole){ %>checked <% } %>/> 高级信息（获取居民身份高级信息）
		</div>
		<hr>
	</div>

	<div class="form-group">
		<label>每日最高使用次数(-1不限制)：</label>
		<div class="">
			<input type="number" class="form-control" name="business-limit" value="<%= user.business.limit %>"/>
		</div>
	</div>
	<div class="form-group">
		<label>有效期：</label>
		<div class="">
			<input type="text" class="form-control" name="business-expired" value="<%= user.business.expired %>" placeholder=""/>
		</div>
	</div>
<% } %>

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
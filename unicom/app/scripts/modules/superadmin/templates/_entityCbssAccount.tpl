<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">CBSS账户管理</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="item" id="<%= model._id %>">
	 		<div class="pull-right">
				<% if(!model.login){ %>
					<button class="btn btn-primary login">登录</button>
				<% } %>

 				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.username %></h4>
			<p>所属省份：<%= model.province_name %>&nbsp;&nbsp;账户状态：<%= model.status %></p>
			<!-- <p>登录状态：<%= model.login %></p> -->
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改账户</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="username">账户名称：</label>
						<input type="text" name="username" value="<%= model.username %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="username">账户所属省份：</label>
						<input type="text" name="province_name" value="<%= model.province_name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="username">账户所属省份编码：</label>
						<input type="text" name="province_id" value="<%= model.province_id %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="password">密码：</label>
						<input type="password" name="password" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="cpassword">密码(再次)：</label>
						<input type="password" name="cpassword" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效&nbsp;&nbsp;
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效&nbsp;&nbsp;
						</div>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
								<input type="submit" value="提交" class="btn btn-danger">
							</div>
							<div class="btn-group">
								<button class="btn btn-primary back">取消</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<h3>应用接口参数</h3>
<hr>
<a class="btn btn-danger pull-right regenerate">重新设置</a>
<h4><strong>app_id：</strong><span><%= user.app.app_id %></span></h4>
<h4><strong>app_secret：</strong><span><%= user.app.app_secret %></span></h4>
<hr>
<p>注意：重新设置可能会使正在使用的服务失效，请确保您明白您所做的行为。</p>
<form>
	<div class="form-group">
		<label><h4>API权限：</h4></label>
		<div class="">
			<input type="checkbox" name="app" value="base" <% if(user.app.apis.base){ %>checked <% } %>/> 基本对比服务
			<input type="checkbox" name="app" value="photoBase" <% if(user.app.apis.photoBase){ %>checked <% } %>/> 获取照片服务
		</div>
	</div>
	<div class="form-group">
		<input type="submit" class="btn btn-primary btn-block" value="提交">
	</div>
</form>
<hr>
<h4>常见问题</h4>
<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">应用管理</h4>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>	
	<div id="itemTemplate">
		<hr/>
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4>名称：<%= model.name %>&nbsp;[<span><%= model.nickname %>]&nbsp;</span></h4>
		<p>描述：<%= model.description %></p>
	</div>
 	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改应用</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>应用名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" placeholder="中英文字母">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>应用编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control" placeholder="字母、_或数字的组合">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>应用描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>可用资源：</label>
						<div style="padding-left:30px;" id="features">
						</div>
					</div>
 					<div class="form-group">
						<label>是否是默认应用：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="isDefault" value="false">&nbsp;&nbsp;否
							<input type="radio" name="isDefault" value="true">&nbsp;&nbsp;是
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
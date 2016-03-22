<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-left">
				<a class="btn btn-primary" href="#product/direct/index">返回</a>
			</div>
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">产品分类管理</h4>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>	
	<div id="itemTemplate">
		<div>
			<div class="item" id="<%= model._id %>">
				<hr/>
				<div class="pull-left">
					
				</div>
				<div class="pull-right" >
					<button class="btn btn-success edit">编辑</button>
					<button class="btn btn-danger delete">删除</button>
				</div>
				<h4><img src="" width="50px" height="50px"><%= model.name %></h4>
			</div>
		</div>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改分类</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>图标：</label>
						<input type="text" name="thumbnail" value="<%= model.thumbnail %>" class="form-control">
						<span class="help-block"></span>
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
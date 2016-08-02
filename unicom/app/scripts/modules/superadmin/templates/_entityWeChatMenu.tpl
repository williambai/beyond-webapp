<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary export">推送菜单</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">菜单管理</h4>
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
				<button class="btn btn-success edit">编辑</button>
				<button class="btn btn-danger delete">删除</button>
			</div>
			<h4><%= model.name %></h4>
			<p>路径：<%= model.path %>&nbsp;&nbsp;</p>
			<!-- <p>序号：<%= model.display_sort %></p> -->
		</div>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改菜单</h4>
			</div>
			<div class="panel-body">
				<form id="accountForm">
					<div class="form-group">
						<label for="name">菜单名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="description">菜单描述：</label>
						<textarea name="description" class="form-control"><%= model.description %></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>菜单类型：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="click" checked>&nbsp;&nbsp;点击推事件&nbsp;&nbsp;
							<input type="radio" name="category" value="view">&nbsp;&nbsp;跳转URL&nbsp;&nbsp;
						</div>
					</div>
					<div class="form-group">
						<label for="target">菜单命令：</label>
						<input type="text" name="target" value="<%= model.target %>" class="form-control" placeholder="关键字或url">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="target">菜单序号：</label>
						<input type="text" name="display_sort" value="<%= model.display_sort %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label for="parent">上级菜单：</label>
						<input type="hidden" name="parent">
						<input type="text" name="path" value="<%= model.path %>" class="form-control" placeholder="请输入上级菜单名称，并选择">
						<span class="help-block"></span>
						<div id="menus"></div>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;有效
							<input type="radio" name="status" value="无效">&nbsp;无效
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
	<div id="exportTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">推送菜单</h4>
			</div>
			<div class="panel-body">
				<p>注意：本操作将修改微信公众号的菜单。</p>
				<form id="exportForm">
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
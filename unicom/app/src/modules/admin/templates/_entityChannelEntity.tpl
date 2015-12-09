<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">渠道管理</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>	
	<div id="searchTemplate">
		<form id="searchForm" class="form-inline">
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="渠道名称或渠道代码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>渠道类型：</label>
				<select class="form-control category">
					<option>全部</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control">
					<option>全部</option>
					<option>有效</option>
					<option>无效</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<input type="submit" value="查询" class="btn btn-info btn-block">
			</div>
		</form>
		<hr/>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model.name %></h4>
		<p></p>
		<hr/>
	</div>
	<div id="addTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增渠道</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>管理部门：</label>
						<input type="text" name="parent" list="departments" value="" class="form-control" placeholder="请输入组织名称">
						<datalist id="departments">
						</datalist>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道类型：</label>
						<select class="form-control category">
						</select>&nbsp;&nbsp;
					</div>
					<div class="form-group">
						<label>渠道名称：</label>
						<input type="text" name="name" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道编码：</label>
						<input type="text" name="nickname" value="" class="form-control">
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
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增渠道</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>管理部门：</label>
						<input type="text" name="parent" list="departments" value="" class="form-control" placeholder="请输入组织名称">
						<datalist id="departments">
						</datalist>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道类型：</label>
						<select class="form-control category">
						</select>&nbsp;&nbsp;
					</div>
					<div class="form-group">
						<label>渠道名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>渠道编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control">
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
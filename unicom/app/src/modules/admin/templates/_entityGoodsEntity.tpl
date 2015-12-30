<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">物料管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="物料名称或物料代码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>物料类型：</label>
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
		<h4><%= model.name %> (<%= model.nickname %>)</h4>
		<p>业务类型：<%= model.category %>, 状态：<%= model.status %></p>
		<hr/>
	</div>
	<div id="addTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增物料</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="name" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="nickname" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料描述：</label>
						<textarea name="description" class="form-control"></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料类型：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="流量业务">&nbsp;&nbsp;流量业务
							<input type="radio" name="category" value="增值业务">&nbsp;&nbsp;增值业务
							<input type="radio" name="category" value="号卡业务">&nbsp;&nbsp;号卡业务
							<input type="radio" name="category" value="终端业务">&nbsp;&nbsp;终端业务
							<input type="radio" name="category" value="兑换业务">&nbsp;&nbsp;兑换业务
						</div>
					</div>
					<div class="form-group">
						<label>物料业务ID：</label>
						<input type="text" name="sourceId" value="" class="form-control" placeholder="BSS系统对应的业务ID">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效
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
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改物料</h4>
			</div>
			<div class="panel-body">
				<form id="roleForm">
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料描述：</label>
						<textarea name="description" class="form-control"><%= model.description%></textarea>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料类型：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="流量业务">&nbsp;&nbsp;流量业务
							<input type="radio" name="category" value="增值业务">&nbsp;&nbsp;增值业务
							<input type="radio" name="category" value="号卡业务">&nbsp;&nbsp;号卡业务
							<input type="radio" name="category" value="终端业务">&nbsp;&nbsp;终端业务
							<input type="radio" name="category" value="兑换业务">&nbsp;&nbsp;兑换业务
						</div>
					</div>
					<div class="form-group">
						<label>物料业务ID：</label>
						<input type="text" name="sourceId" value="<%= model.sourceId %>" class="form-control" placeholder="BSS系统对应的业务ID">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效
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
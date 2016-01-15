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
			<input type="hidden" name="action" value="search">
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="物料名称或物料类型">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option value="">全部</option>
					<option value="有效">有效</option>
					<option value="无效">无效</option>
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
		<p>类型：<%= model.category %>, 状态：<%= model.status %></p>
		<p><%= model.description %></p>
		<hr/>
	</div>
 	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">修改物料</h4>
			</div>
			<div class="panel-body">
				<form id="goodsForm">
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
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
							<input type="radio" name="category" value="流量业务" checked>&nbsp;&nbsp;流量业务
							<input type="radio" name="category" value="增值业务">&nbsp;&nbsp;增值业务
							<input type="radio" name="category" value="号卡业务">&nbsp;&nbsp;号卡业务
							<input type="radio" name="category" value="终端业务">&nbsp;&nbsp;终端业务
							<input type="radio" name="category" value="兑换业务">&nbsp;&nbsp;兑换业务
						</div>
					</div>
					<div class="form-group">
						<label>物料数量：</label>
						<input type="text" name="quantity" value="<%= model.quantity %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>参考价格：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>价格单位：</label>
						<input type="text" name="unit" value="<%= model.unit %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>第三方系统ID：</label>
						<input type="text" name="foreigner" value="<%= model.foreigner %>" class="form-control" placeholder="BSS系统对应的业务ID">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
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
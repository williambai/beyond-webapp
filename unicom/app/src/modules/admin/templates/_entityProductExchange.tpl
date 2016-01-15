<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">兑换商品管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="商品名称或物料名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select name="status" class="form-control">
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
		<h4><%= model.name %>&nbsp;<span class="bg-success"><%= model.status %></span></h4>
		<p>产品分类：<%= model.category %></p>
		<p><%= model.description %></p>
		<%if(model.starttime){ %>
		<p>上架时间：<%= model.starttime %> ~ <%= model.endtime %></p>
		<% } %>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center" id="panel-title">编辑产品</h4>
			</div>
			<div class="panel-body">
				<form id="phoneForm">
					<div class="form-group">
						<label>商品名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>商品描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>商品类型：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="category" value="虚拟">&nbsp;&nbsp;虚拟
							<input type="radio" name="category" value="实物" checked>&nbsp;&nbsp;实物
						</div>
					</div>
					<div class="form-group">
						<label>图标：</label>
						<input type="text" name="thumbnail_url" value="<%= model.thumbnail_url %>" class="form-control">
						<div id="images"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所需金币：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>兑换条件：</label>
						<input type="text" name="limit" value="<%= model.uptime %>" class="form-control" placeholder="要求金币总数大于该数量才可以兑换">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>兑换数量：</label>
						<input type="text" name="quantity" value="<%= model.quantity %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<lable>开放时间：</lable>
						<input type="Date" name="starttime" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<lable>结束时间：</lable>
						<input type="Date" name="endtime" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>显示序号（降序排列）：</label>
						<input type="text" name="display_sort" value="<%= model.display_sort %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="goods[name]" value="<%= model.goods.name %>" placeholder="请输入物料名称，从列表中选择物料" class="form-control">
						<div id="goods"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="goods[id]" value="<%= model.goods.id %>" class="form-control" readonly>
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
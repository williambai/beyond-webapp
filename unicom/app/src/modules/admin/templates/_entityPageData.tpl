<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">流量产品配置</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="物料ID或物料名称">&nbsp;&nbsp;
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
		<h4><%= model.subject %></h4>
		<p><%= model.description %></p>
		<hr/>
	</div>
	<div id="addTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增产品</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>产品类型：</label>
						<input type="radio" name="category" value="2G流量">&nbsp;&nbsp;2G流量
						<input type="radio" name="category" value="3G流量" checked>&nbsp;&nbsp;3G流量
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="goods[nickname]" value="" class="form-control">
						<div id="goods"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="goods[name]" value="" class="form-control" readonly>
						<input type="hidden" name="goods[sourceId]" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品标题：</label>
						<input type="text" name="subject" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品描述：</label>
						<input type="text" name="description" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品价格：</label>
						<input type="text" name="price" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>价格单位：</label>
						<input type="text" name="unit" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>显示序号（降序排列）：</label>
						<input type="text" name="display_sort" value="0" class="form-control">
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
				<h4 class="panel-title text-center">编辑产品</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>产品类型：</label>
						<input type="radio" name="category" value="2G流量">&nbsp;&nbsp;2G流量
						<input type="radio" name="category" value="3G流量">&nbsp;&nbsp;3G流量
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料编码：</label>
						<input type="text" name="goods[nickname]" value="<%= model.goods.nickname %>" class="form-control">
						<div id="goods"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="goods[name]" value="<%= model.goods.name %>" class="form-control" readonly>
						<input type="hidden" name="goods[sourceId]" value="<%= model.goods.sourceId %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品标题：</label>
						<input type="text" name="subject" value="<%= model.subject %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品价格：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>价格单位：</label>
						<input type="text" name="unit" value="<%= model.unit %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>显示序号（降序排列）：</label>
						<input type="text" name="display_sort" value="<%= model.display_sort %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
							<input type="radio" name="status" value="有效">&nbsp;&nbsp;有效
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
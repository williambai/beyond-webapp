<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<a class="btn btn-primary" href="#product/category/index">产品分类</a>
				<button class="btn btn-primary add">新增产品</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">直通产品管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="产品名称或物料名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;产品分类：&nbsp;</label>
				<select name="category" class="form-control">
					<option value="">全部</option>
					<option value="2G">2G流量</option>
					<option value="3G">3G流量</option>
					<option value="4G">4G流量</option>
					<option value="SMS">增值服务</option>
					<option value="APP">应用推荐</option>
					<option value="EVENT">活动推荐</option>
				</select>&nbsp;&nbsp;
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
		<div>
			<div class="item" id="<%= model._id %>">
				<div class="row">
					<div class="col-xs-1">
						<img width="50px" heigh="50px">
					</div>
					<div class="col-xs-9">
						<h4><%= model.name %>&nbsp;<span class="bg-success"><%= model.status %></span></h4>
						<p>产品分类：<%= model.category %></p>
						<p>产品标签：<%= model.tags.join('  ') %></p>
						<%if(model.starttime){ %>
						<p>活动时间：<%= model.starttime %> ~ <%= model.endtime %></p>
						<% } %>
					</div>
					<div class="col-xs-2">
						<button class="btn btn-success edit">编辑</button>
						<button class="btn btn-danger delete">删除</button>
					</div>
				</div>
				<hr/>
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
						<label>产品名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品类别：</label>
						<select name="category" class="form-control">
						</select>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>产品图标：</label>
						<input type="text" name="thumbnail_url" value="<%= model.thumbnail_url %>" class="form-control">
						<div id="images"></div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>链接地址：</label>
						<input type="text" name="url" value="<%= model.url %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>活动开始时间：</label>
						<input type="date" name="starttime" value="" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>活动结束时间：</label>
						<input type="date" name="endtime" value="" class="form-control">
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
						<label>产品数量：</label>
						<input type="text" name="quantity" value="0" class="form-control">
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
						<label>佣金：</label>
						<input type="text" name="bonus[income]" value="<%= model.bonus.income %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>返佣分批次数：</label>
						<input type="text" name="bonus[times]" value="<%= model.bonus.times %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>积分：</label>
						<input type="text" name="bonus[points]" value="<%= model.bonus.points %>" class="form-control">
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
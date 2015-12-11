<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">金币管理</h4>
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
				<label>&nbsp;开始时间&nbsp;</label>
				<input type="date" name="starttime" class="form-control">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;结束时间&nbsp;</label>
				<input type="date" name="endtime" class="form-control">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="客户号码">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>业务类型：</label>
				<select class="form-control" name="category">
					<option>全部</option>
				</select>&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control" name="status">
					<option>全部</option>
					<option>冻结</option>
					<option>一次解冻</option>
					<option>二次解冻</option>
					<option>三次解冻</option>
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
		<h4><%= model.username %></h4>
		<p><%= model.product.name %></p>
		<hr/>
	</div>
</div>
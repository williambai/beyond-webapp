<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">号卡产品管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="套餐名称或分类名称">&nbsp;&nbsp;
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
		<h4><%= model.name %></h4>
		<p><%= model.description %></p>
		<p>分类：<%= model.category %>&nbsp;&nbsp;<%= model.classification %></p>
		<hr/>
	</div>
	<div id="editTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">编辑套餐</h4>
			</div>
			<div class="panel-body">
				<form id="packageForm">
					<div class="form-group">
						<label>套餐名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" placeholder="如，46元套餐">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control" placeholder="简要描述">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐分类：</label>
						<input type="text" name="category" value="<%= model.category %>" class="form-control" placeholder="如，套餐A，自由套餐等">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>业务类型(自由套餐有效)：</label>
						<input type="text" name="classification" value="<%= model.classification %>" class="form-control" placeholder="如，全国流量包等">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码类型：</label>
						<div style="padding-left:30px;">
							<input type="checkbox" name="cardType[]" value="普通号码">&nbsp;普通号码&nbsp;
							<input type="checkbox" name="cardType[]" value="AAAAA">&nbsp;AAAAA&nbsp;
							<input type="checkbox" name="cardType[]" value="AAAA">&nbsp;AAAA&nbsp;
							<input type="checkbox" name="cardType[]" value="ABCDE">&nbsp;ABCDE&nbsp;
							<input type="checkbox" name="cardType[]" value="ABCD">&nbsp;ABCD&nbsp;
							<input type="checkbox" name="cardType[]" value="AAA">&nbsp;AAA&nbsp;
							<input type="checkbox" name="cardType[]" value="AABB">&nbsp;AABB&nbsp;
							<input type="checkbox" name="cardType[]" value="ABAB">&nbsp;ABAB&nbsp;
							<input type="checkbox" name="cardType[]" value="ABC">&nbsp;ABC&nbsp;
							<input type="checkbox" name="cardType[]" value="AA">&nbsp;AA&nbsp;
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码预存：</label>
						<input type="text" name="cardPrice" value="<%= model.cardPrice %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐价格：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>价格单位：</label>
						<input type="text" name="unit" value="<%= model.unit %>" class="form-control" placeholder="如，元/月">
						<span class="help-block"></span>
					</div>
					<input type="hidden" name="quantity" value="1">
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
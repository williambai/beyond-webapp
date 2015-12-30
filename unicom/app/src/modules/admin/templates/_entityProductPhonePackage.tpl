<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">终端套餐设置</h4>
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
			<input type="hidden" name="type" value="search">
			<div class="form-group">
				<label>&nbsp;&nbsp;</label>
				<input type="text" name="searchStr" class="form-control" placeholder="套餐类型名称">&nbsp;&nbsp;
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
		<h4>类型：<%= model.name %>&nbsp;[<%= model.nickname %>]</h4>
		<p>描述：<%= model.description %></p>
		<p>合约期：<%= model.months %>&nbsp;个月&nbsp;&nbsp;套餐价格：<%= model.price %></p>
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
						<label>套餐类型名称：</label>
						<input type="text" name="name" value="<%= model.name %>" class="form-control" placeholder="存费送机、购机送费、机卡绑定、裸机销售等">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐类型编码：</label>
						<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control" placeholder="由字母、_或数字组成">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐类型描述：</label>
						<input type="text" name="description" value="<%= model.description %>" class="form-control" placeholder="简要描述">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>合约期：</label>
						<div class="input-group">
							<input type="text" name="months" value="<%= model.months %>" class="form-control">
							<span class="input-group-addon">个月</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐：</label>
						<input type="text" name="suite_name" value="<%= model.suite_name %>" class="form-control" placeholder="套餐名称，如，3G基本套餐A、iPhone套餐等">
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
						<label>套餐月费：</label>
						<div class="input-group">
							<input type="text" name="suite_price" value="<%= model.suite_price %>" class="form-control">
							<span class="input-group-addon">元</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>总价：</label>
						<div class="input-group">
							<input type="text" name="total" value="<%= model.total %>" class="form-control">
							<span class="input-group-addon">元</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>预存：</label>
						<div class="input-group">
							<input type="text" name="pre_pay" value="<%= model.pre_pay %>" class="form-control">
							<span class="input-group-addon">元</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>月返：</label>
						<div class="input-group">
							<input type="text" name="month_return" value="<%= model.month_return %>" class="form-control">
							<span class="input-group-addon">元</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>入网返：</label>
						<div class="input-group">
							<input type="text" name="online_return" value="<%= model.online_return %>" class="form-control">
							<span class="input-group-addon">元</span>
						</div>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>优惠说明：</label>
						<input type="text" name="coupon" value="<%= model.coupon %>" class="form-control">
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
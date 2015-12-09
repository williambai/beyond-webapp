<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary import">导入</button>
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">卡号管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="卡号、物料ID或名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<select class="form-control">
					<option>全部</option>
					<option>未用</option>
					<option>已用</option>
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
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model.cardNo %></h4>
		<p>类型：<%= model.category %>, 预存<%= model.price %>元</p>
		<hr/>
	</div>
	<div id="addTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">新增卡号</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>卡号：</label>
						<input type="text" name="cardNo" value="<%= model.cardNo %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料ID：</label>
						<input type="text" name="goodsId" value="<%= model.goodsId %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="goodsName" value="<%= model.goodsName %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属号段：</label>
						<select name="cardRange" class="form-control">
							<option>186</option><option>185</option><option>156</option><option>131</option><option>130</option><option>155</option><option>132</option>
						</select>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码类型：</label>
						<select name="category" class="form-control">
							<option>AAAAA</option><option>AAAA</option><option>ABCDE</option><option>ABCD</option><option>AAA</option><option>AABB</option><option>ABAB</option><option>ABC</option><option>AA</option><option>普通号码</option>
						</select>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码预存：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="hidden" name="status[code]" value="0">
							<input type="checkbox" name="status[code]" value="1">有效
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
				<h4 class="panel-title text-center">修改卡号</h4>
			</div>
			<div class="panel-body">
				<form id="customerForm">
					<div class="form-group">
						<label>卡号：</label>
						<input type="text" name="cardNo" value="<%= model.cardNo %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料ID：</label>
						<input type="text" name="goodsId" value="<%= model.goodsId %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>物料名称：</label>
						<input type="text" name="goodsName" value="<%= model.goodsName %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>所属号段：</label>
						<select name="cardRange" class="form-control">
							<option>186</option><option>185</option><option>156</option><option>131</option><option>130</option><option>155</option><option>132</option>
						</select>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码类型：</label>
						<select name="category" class="form-control">
							<option>AAAAA</option><option>AAAA</option><option>ABCDE</option><option>ABCD</option><option>AAA</option><option>AABB</option><option>ABAB</option><option>ABC</option><option>AA</option><option>普通号码</option>
						</select>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>号码预存：</label>
						<input type="text" name="price" value="<%= model.price %>" class="form-control">
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>状态：</label>
						<div style="padding-left:30px;">
							<input type="hidden" name="status[code]" value="0">
							<input type="checkbox" name="status[code]" value="1">已用
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
	<div id="importTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">导入卡号</h4>
			</div>
			<div class="panel-body">
				<p>请点击<i class="fa fa-plus-circle"></i>选择要上传的文件，点击已上传的文件，可以取消上传。</p>
				<form>
					<div class="form-group">
						<span class="attachments"></span>
						<span>
							<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i>
							</button>
						</span>
					</div>
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="导入" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</form>
				<input class="hidden" type="file" name="file"/>
			</div>
		</div>

	</div>	
</div>
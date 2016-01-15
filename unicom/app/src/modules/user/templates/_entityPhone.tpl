<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">终端产品</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div>
			<div class="media">
				<div class="media-left" id="<%= model._id %>">
					<img class="media-object view" src="" width="80px" height="80px" style="max-width:100px;">
				</div>
				<div class="media-body">
					<div class="pull-right" id="<%= model._id %>">
						<button class="btn btn-success add">推荐</button>
					</div>
					<h4><%= model.name %></h4>
					<p>
						<span><%= model.description %></span>
					</p>
					<p>
						<span><%= model.price %>元</span>
					</p>
					<p>
						<% if(model.starttime){ %>
						<span>时间：<%= model.starttime %>到<%= model.endtime %></span>
						<% } %>
					</p>
				</div>
			</div>
			<hr/>
		</div>
	</div>
	<div id="searchTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">终端筛选</h4>
			</div>
			<div class="panel-body">
				<form id="searchForm">
				</form>
			</div>
		</div>
	</div>
	<div id="addTemplate">
		<form>
			<div id="step1">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-title text-center">终端型号</h5>
					</div>
					<div class="panel-body">
						<p class="text-center">
							<img id="thumbnail_url" width="50%">
						</p>
						<h4 class="text-center">
							<%= model.name %>
						</h4>
						<p class="text-center">
							<%= model.description %>
						</p>
						<hr/>
						<p>
							价格：<span class="pull-right"><%= model.price %></span>
							<hr/>
						</p>
						<p>
							颜色：<span class="pull-right"><%= model.params.color %></span>
							<hr/>
						</p>
						<p>
							存储：<span class="pull-right"><%= model.params.storage %></span>
							<hr/>
						</p>
						<p>
							库存：<span class="pull-right"><%= model.params.quantity %></span>
							<hr/>
						</p>
						<p>
							附件：<span class="pull-right"><%= model.params.addons %></span>
							<hr/>
						</p>
						<p>
							图文详情：<span class="pull-right" id="<%= model._id %>"><a class="view">手机参数、合约套餐</a></span>
							<hr/>
						</p>
					</div>
				</div>
			</div>
			<div id="step2">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-title text-center">合约套餐</h5>
					</div>
					<div class="panel-body">
						<div id="packages"></div>
						<div class="form-group">
							<label>生效时间：</label>
							<input type="radio" name="starttime" value="立即" checked>&nbsp;&nbsp;立即&nbsp;&nbsp;
							<input type="radio" name="starttime" value="半月">&nbsp;&nbsp;半月&nbsp;&nbsp;
							<input type="radio" name="starttime" value="次月">&nbsp;&nbsp;次月&nbsp;&nbsp;
							<span class="help-block"></span>
						</div>
						<hr/>
						<div class="pull-right">
							<h5>终端价格：<%= model.price %></h5>
							<h5>合约价格：<span id="packagePrice">5000</span></h5>
							<hr/>
							<h4>总价：<%= model.total %></h4>
						</div>
					</div>
				</div>
			</div>
	<!-- 		<div id="step2">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-title text-center">终端合约</h5>
					</div>
					<div class="panel-body">
						<div>
							<div class="form-group">
								<label>合约类型：</label>
								<select name="package[category]" class="form-control">
								</select>&nbsp;&nbsp;
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>合约时长：</label>
								<select name="package[months]" class="form-control">
								</select>&nbsp;&nbsp;
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>套餐月费：</label>
								<select name="package[price]" class="form-control">
								</select>&nbsp;元&nbsp;&nbsp;
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>套餐：</label>
								<select name="package[name]" class="form-control">
								</select>&nbsp;&nbsp;
								<span class="help-block"></span>
							</div>
						</div>
						<hr/>
						<div class="pull-right">
							<h5>终端价格：<%= model.price %></h5>
							<h5>合约价格：<span id="packagePrice">5000</span></h5>
							<hr/>
							<h4>总价：<%= model.total %></h4>
						</div>
					</div>
				</div>
			</div> -->
			<div id="step3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-title text-center">客户信息</h5>
					</div>
					<div class="panel-body">
						<div class="form-group">
							<label>客户姓名：</label>
								<input type="text" name="customer[name]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>证件类型：</label>
								<input type="text" name="customer[idType]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>证件号码：</label>
								<input type="text" name="customer[idNo]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>证件地址：</label>
								<input type="text" name="customer[idAddress]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>联系电话：</label>
								<input type="text" name="customer[phone]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>联系地址：</label>
								<input type="text" name="customer[address]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<label>营业厅：</label>
								<input type="text" name="place[name]" class="form-control">
								<span class="help-block"></span>
						</div>
						<div class="form-group">
							<div class="btn-group btn-group-justified">
								<div class="btn-group">
								<input type="submit" value="推荐" class="btn btn-danger">
							</div>
							<div class="btn-group">
								<button class="btn btn-primary back">取消</button>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>		
		</form>
	</div>
	<div id="viewTemplate">
		<div id="step1">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">手机参数</h5>
				</div>
				<div class="panel-body">
					<p class="text-center">
						<img id="thumbnail_url" width="50%">
					</p>
					<h4 class="text-center">
						<%= model.name %>
					</h4>
					<p class="text-center">
						<%= model.description %>
					</p>
					<hr/>
					<p>
						品牌：<span class="pull-right"><%= model.params.brand %></span>
						<hr/>
					</p>
					<p>
						型号：<span class="pull-right"><%= model.params.type %></span>
						<hr/>
					</p>
					<p>
						价格：<span class="pull-right"><%= model.price %></span>
						<hr/>
					</p>
					<p>
						颜色：<span class="pull-right"><%= model.params.color %></span>
						<hr/>
					</p>
					<p>
						存储：<span class="pull-right"><%= model.params.storage %></span>
						<hr/>
					</p>
					<p>
						库存：<span class="pull-right"><%= model.params.quantity %></span>
						<hr/>
					</p>
					<p>
						附件：<span class="pull-right"><%= model.params.addons %></span>
						<hr/>
					</p>
				</div>
			</div>
		</div>
		<div id="step2">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">合约套餐</h5>
				</div>
				<div class="panel-body">
					<div id="packages"></div>
				</div>
			</div>
		</div>
		<button class="btn btn-primary btn-block back">返回</button>
	</div>
</div>

<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary add">新增</button>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">终端产品管理</h4>
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
				<input type="text" name="searchStr" class="form-control" placeholder="物料ID或物料名称">&nbsp;&nbsp;
			</div>
			<div class="form-group">
				<label>&nbsp;产品分类：&nbsp;</label>
				<select name="category" class="form-control">
					<option>全部</option>
					<option value="2G">2G流量</option>
					<option value="3G">3G流量</option>
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
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success edit">编辑</button>
			<button class="btn btn-danger delete">删除</button>
		</div>
		<h4><%= model.params.brand %>&nbsp;<span class="bg-success"><%= model.status %></span></h4>
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
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">手机参数</h4>
						</div>
						<div class="panel-body">
							<div class="form-group">
								<label>手机品牌：</label>
								<input type="text" name="params[brand]" value="<%= model.params.brand %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>手机型号：</label>
								<input type="text" name="params[type]" value="<%= model.params.type %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>手机颜色：</label>
								<input type="text" name="params[color]" value="<%= model.params.color %>" class="form-control" placeholder="黑色、白色、金色等">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>操作系统：</label>
								<input type="text" name="params[os]" value="<%= model.params.os %>" class="form-control" placeholder="苹果、安卓等">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>主摄像头：</label>
								<input type="text" name="params[camera1]" value="<%= model.params.camera1 %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>辅摄像头：</label>
								<input type="text" name="params[camera2]" value="<%= model.params.camera2 %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>屏幕尺寸：</label>
								<input type="text" name="params[size]" value="<%= model.params.size %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>屏幕材质：</label>
								<input type="text" name="params[meteral]" value="<%= model.params.meteral %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>分变率：</label>
								<input type="text" name="params[resolution]" value="<%= model.params.resolution %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>SIM卡：</label>
								<input type="text" name="params[sim]" value="<%= model.params.sim %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>插卡数：</label>
								<input type="text" name="params[sim_num]" value="<%= model.params.sim_num %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>CPU：</label>
								<input type="text" name="params[cpu]" value="<%= model.params.cpu %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>存储容量：</label>
								<input type="text" name="params[storage]" value="<%= model.params.storage %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>运行内存：</label>
								<input type="text" name="params[memeory]" value="<%= model.params.memeory %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>最大扩展：</label>
								<input type="text" name="params[extension]" value="<%= model.params.extension %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>电池容量：</label>
								<input type="text" name="params[battery]" value="<%= model.params.battery %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>通话时长：</label>
								<input type="text" name="params[call_time]" value="<%= model.params.call_time %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>待机时长：</label>
								<input type="text" name="params[idel_time]" value="<%= model.params.idel_time %>" class="form-control" placeholder="">
								<span class="help-block"></span>
							</div>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">产品设置</h4>
						</div>
						<div class="panel-body">
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
								<label>产品名称：</label>
								<input type="text" name="name" value="<%= model.name %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>产品编码：</label>
								<input type="text" name="nickname" value="<%= model.nickname %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>描述：</label>
								<input type="text" name="description" value="<%= model.description %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>图标：</label>
								<input type="text" name="thumbnail_url" value="<%= model.thumbnail_url %>" class="form-control">
								<div id="images"></div>
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>价格：</label>
								<input type="text" name="price" value="<%= model.price %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>库存数量：</label>
								<input type="text" name="quantity" value="<%= model.quantity %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>上市时间：</label>
								<input type="text" name="uptime" value="<%= model.uptime %>" class="form-control" placeholder="如，2015-12-01">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>产品附件：</label>
								<textarea name="addons" value="<%= model.addons %>" class="form-control" placeholder="文字描述随附产品"></textarea>
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>显示序号（降序排列）：</label>
								<input type="text" name="display_sort" value="<%= model.display_sort %>" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<lable>生效开始时间：</lable>
								<input type="Date" name="starttime" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<lable>生效结束时间：</lable>
								<input type="Date" name="endtime" class="form-control">
								<span class="help-block"></span>
							</div>
							<div class="form-group">
								<label>状态：</label>
								<div style="padding-left:30px;">
									<input type="radio" name="status" value="无效">&nbsp;&nbsp;无效
									<input type="radio" name="status" value="有效" checked>&nbsp;&nbsp;有效
								</div>
							</div>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title text-center">合约设置</h4>
						</div>
						<div class="panel-body">
							<div class="form-inline">
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
								<button class="btn btn-primary packageAdd"><i class="fa fa-plus fa-lg"></i></button>
							</div>
							<hr/>
							<div id="packages">
							</div>
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
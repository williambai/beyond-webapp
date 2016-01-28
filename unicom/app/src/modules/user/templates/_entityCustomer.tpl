<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary"><i class="fa fa-filter fa-lg"></i></button>
			</div>
			<div class="panel-heading">
				<h5 class="panel-title text-center">我的客户</h5>
			</div>
			<div class="panel-body">
				<div id="list">
				</div>
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<!-- <button class="btn btn-success recommend">推荐产品</button> -->
			<a class="btn btn-danger" href="tel:<%= model.mobile %>">打电话</a>
			<!-- <button class="btn btn-info view">了解客户</button> -->
		</div>

 		<h4>客户：<%= model.name %>&nbsp;&nbsp;<%= model.mobile %></h4>
		<p>客户关怀：3天前&nbsp;&nbsp;&nbsp;当前状态：有效</p>
		<hr/>
	</div>
	<div id="searchTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">筛选条件</h4>
			</div>
			<div class="panel-body">
				<form id="searchForm">
					<input type="hidden" name="type" value="search">
					<div class="form-group">
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<input type="reset" value="重置" class="btn btn-primary">
						</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

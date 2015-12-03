<div>
	<div id="indexTemplate">
		<button class="btn btn-primary pull-right search">过滤</button>
		<p>&nbsp;</p>
		<hr/>
		<div class="container">
			<div class="row bg-info">
				<div class="col-xs-4">号码</div>
				<div class="col-xs-4">预存</div>
				<div class="col-xs-4"><a class="recommend">推荐</a></div>
			</div>
			<div id="list">
			</div>
		</div>
	</div>
	<div id="itemTemplate">
		<div class="row">
			<div class="col-xs-4">号码</div>
			<div class="col-xs-4">预存</div>
			<div class="col-xs-4 recommend">推荐</div>
		</div>
	</div>
	<div id="searchTemplate">
		<button class="btn btn-primary back">返回</button>
		<hr/>
		<form id="searchForm">
			<div class="form-group">
				<label>号段：</label>
				<input type="text" name="range" class="form-control">
				<span class="help-block"></span>
			</div>
			<div class="form-group">
				<label>靓号类型：</label>
				<input type="text" name="category" class="form-control">
				<span class="help-block"></span>
			</div>
			<div class="form-group">
				<label>预存话费：</label>
				<input type="text" name="price" class="form-control">
				<span class="help-block"></span>
			</div>
			<div class="form-group">
				<input type="submit" value="确定" class="btn btn-primary btn-block">
			</div>
		</form>
	</div>
	<div id="recommendTemplate">
		<button class="btn btn-primary back">返回</button>
		<hr/>
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">卡号信息</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>卡号：</label>
						<input type="text" name="mobile" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐：<a id="selectPackage">选择套餐</a></label>
						<input type="text" name="mobile" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<hr/>
					<div class="form-group">
						<label>总价：</label>
						<input type="text" name="price" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
				</div>
			</div>
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
							<input type="text" name="customer[cardtype]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件号码：</label>
							<input type="text" name="customer[cardno]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>证件地址：</label>
							<input type="text" name="customer[address]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系电话：</label>
							<input type="text" name="customer[contact][phone]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>联系地址：</label>
							<input type="text" name="customer[contact][address]" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>营业厅：</label>
							<input type="text" name="" class="form-control">
							<span class="help-block"></span>
					</div>
					<div class="form-group">
						<input type="submit" value="确定订购" class="btn btn-primary btn-block">
					</div>
				</div>
			</div>
		</form>
	</div>
	<div id="packageTemplate">
		<button class="btn btn-primary back">返回</button>
		<hr/>
		<div class="tabs">
			<div class="row">
				<div class="col-xs-3">A套餐</div>
				<div class="col-xs-3">B套餐</div>
				<div class="col-xs-3">C套餐</div>
				<div class="col-xs-3">自由组合</div>
			</div>
			<div class="tab">
			</div>
			<div class="tab">
			</div>
			<div class="tab">
			</div>
			<div class="tab">
				<form>
					<h4>全国流量包</h4>
					<h4>全国语音包</h4>
					<h4>短/彩信包</h4>
					<h4>来电显示</h4>
					<div class="form-group">
						<input type="submit" value="确认" class="btn btn-primary btn-block">
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<div>
	<div id="addTemplate">
		<form>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">号卡推荐</h5>
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>号卡：</label>
						<input type="text" name="mobile" class="form-control" readonly>
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>套餐：<a id="selectPackage">选择套餐</a></label>
						<div id="package"></div>
						<input type="text" name="packageName" class="form-control" readonly>
						<input type="hidden" name="package" class="form-control" readonly>
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
						<div class="btn-group btn-group-justified">
							<div class="btn-group">
							<input type="submit" value="确定订购" class="btn btn-danger">
						</div>
						<div class="btn-group">
							<button class="btn btn-primary back">取消</button>
						</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
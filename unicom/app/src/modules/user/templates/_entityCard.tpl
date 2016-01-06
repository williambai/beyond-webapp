<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<div>
					<button class="btn btn-primary search"><i class="fa fa-filter fa-lg"></i></button>
				</div>
			</div>
			<div class="panel-heading">
				<h4 class="panel-title text-center">推荐号卡</h4>
			</div>
			<div class="panel-body">
				<div id="search">
				</div>
				<div id="list">
				</div>
			</div>
		</div>
	</div>	
	<div id="itemTemplate">
		<div class="pull-right" id="<%= model._id %>">
			<button class="btn btn-success view">推荐</button>
		</div>
		<h4>号码：<%= model.name %></h4>
		<p>预存：<%= model.price.toFixed(2) %>&nbsp;<%= model.unit %></p>
		<hr/>
	</div>
	<div id="searchTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title text-center">号卡筛选</h4>
			</div>
			<div class="panel-body">
				<form id="searchForm">
					<div class="form-group">
						<label>号段：</label>
						<input type="checkbox" name="cardRange" value="186">&nbsp;186&nbsp;
						<input type="checkbox" name="cardRange" value="185">&nbsp;185&nbsp;
						<input type="checkbox" name="cardRange" value="156">&nbsp;156&nbsp;
						<input type="checkbox" name="cardRange" value="131">&nbsp;131&nbsp;
						<input type="checkbox" name="cardRange" value="132">&nbsp;132&nbsp;
						<input type="checkbox" name="cardRange" value="155">&nbsp;155&nbsp;
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>靓号类型：</label>
						<input type="checkbox" name="category" value="AAAAA">&nbsp;五连号AAAAA&nbsp;
						<input type="checkbox" name="category" value="AAAA">&nbsp;四连号AAAA&nbsp;
						<input type="checkbox" name="category" value="ABCDE">&nbsp;ABCDE&nbsp;
						<input type="checkbox" name="category" value="ABCD">&nbsp;ABCD&nbsp;
						<input type="checkbox" name="category" value="AAA">&nbsp;AAA&nbsp;
						<input type="checkbox" name="category" value="AABB">&nbsp;AABB&nbsp;
						<input type="checkbox" name="category" value="ABAB">&nbsp;ABAB&nbsp;
						<input type="checkbox" name="category" value="ABC">&nbsp;ABC&nbsp;
						<input type="checkbox" name="category" value="AA">&nbsp;AA&nbsp;
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label>预存话费：</label>
						<input type="radio" name="price" value="0">&nbsp;0~100&nbsp;
						<input type="radio" name="price" value="1">&nbsp;101~200&nbsp;
						<input type="radio" name="price" value="2">&nbsp;201~300&nbsp;
						<input type="radio" name="price" value="3">&nbsp;301~400&nbsp;
						<input type="radio" name="price" value="4">&nbsp;401~500&nbsp;
						<input type="radio" name="price" value="5">&nbsp;501以上&nbsp;
						<span class="help-block"></span>
					</div>
					<div class="form-group">
						<label><u>注：不选，表示此项不限制。</u></label>
					</div>
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
	<div id="viewTemplate">
		<div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title text-center">号卡套餐推荐</h4>
				</div>
				<div class="panel-body">
					<div>
						<h4>手机号码：<%= model.cardNo %></h4>
						<p><a id="togglePackageView">请选择套餐</a></p>
						<p>当前套餐为：<span id="packageSelected">无</span></p>
						<div id="packageView"></div>
					</div>
					<hr/>
					<div>
						<h4 class="text-right">总价：<span id="total"></span>&nbsp;元</h4>
					</div>
				</div>
			</div>
			<div id="recommendView"></div>
		</div>
	</div>
	<div id="packageTemplate">
		<form id="packageForm">
			<div class="panel panel-success">
				<div class="panel-heading">
					<h4 class="panel-title text-center">号卡套餐</h4>
				</div>
				<div class="panel-body">
					<div class="btn-group btn-group-justified">
						<div class="btn btn-success tabControl">A套餐</div>
						<div class="btn btn-default tabControl">B套餐</div>
						<div class="btn btn-default tabControl">C套餐</div>
						<div class="btn btn-default tabControl">自由组合</div>
					</div>
					<hr/>
					<div class="tabs">
						<div class="tab">
							<div class="form-group">
								<a class="bg-success selectItem"><input type="radio" name="product[0]" value="A046" class="hidden">&nbsp;46元套餐</a>&nbsp;
								<input type="radio" name="product[0]" value="A066">&nbsp;66元套餐&nbsp;
								<input type="radio" name="product[0]" value="A096">&nbsp;96元套餐&nbsp;
								<input type="radio" name="product[0]" value="A126">&nbsp;126元套餐&nbsp;
								<input type="radio" name="product[0]" value="A">&nbsp;156元套餐&nbsp;
								<input type="radio" name="product[0]" value="A186">&nbsp;186元套餐&nbsp;
								<input type="radio" name="product[0]" value="A226">&nbsp;226元套餐&nbsp;
								<input type="radio" name="product[0]" value="A286">&nbsp;286元套餐&nbsp;
								<input type="radio" name="product[0]" value="A386">&nbsp;386元套餐&nbsp;
							</div>
						</div>
						<div class="tab">
							<div class="form-group">
								<input type="radio" name="product[0]" value="B046">&nbsp;46元套餐&nbsp;
								<input type="radio" name="product[0]" value="B066">&nbsp;66元套餐&nbsp;
								<input type="radio" name="product[0]" value="B096">&nbsp;96元套餐&nbsp;
								<input type="radio" name="product[0]" value="B126">&nbsp;126元套餐&nbsp;
								<input type="radio" name="product[0]" value="B156">&nbsp;156元套餐&nbsp;
								<input type="radio" name="product[0]" value="B186">&nbsp;186元套餐&nbsp;
							</div>
						</div>
						<div class="tab">
							<div class="form-group">
								<input type="radio" name="product[0]" value="C046">&nbsp;46元套餐&nbsp;
								<input type="radio" name="product[0]" value="C066">&nbsp;66元套餐&nbsp;
								<input type="radio" name="product[0]" value="C096">&nbsp;96元套餐&nbsp;
							</div>
						</div>
						<div class="tab">
								<h4>全国流量包</h4>
								<div class="form-group">
									<input type="radio" name="product[0]" value="DA008">8元包100MB&nbsp;
									<input type="radio" name="product[0]" value="DA016">&nbsp;16元包300MB&nbsp;
									<input type="radio" name="product[0]" value="DA024">&nbsp;24元包500MB&nbsp;
									<input type="radio" name="product[0]" value="DA048">&nbsp;48元包1GB&nbsp;
									<input type="radio" name="product[0]" value="DA072">&nbsp;72元包2GB&nbsp;
									<input type="radio" name="product[0]" value="DA096">&nbsp;96元包3GB&nbsp;
									<input type="radio" name="product[0]" value="DA120">&nbsp;120元包4GB&nbsp;
									<input type="radio" name="product[0]" value="DA152">&nbsp;152元包5GB&nbsp;
									<input type="radio" name="product[0]" value="DA232">&nbsp;232元包11GB&nbsp;
								</div>
								<hr/>
								<h4>全国语音包</h4>
								<div class="form-group">
									<input type="radio" name="product[1]" value="DB032">32元包200分钟&nbsp;
									<input type="radio" name="product[1]" value="DB040">&nbsp;40元包300分钟&nbsp;
									<input type="radio" name="product[1]" value="DB056">&nbsp;56元包500分钟&nbsp;
									<input type="radio" name="product[1]" value="DB112">&nbsp;112元包1000分钟&nbsp;
									<input type="radio" name="product[1]" value="DB160">&nbsp;160元包3000分钟&nbsp;
									<input type="radio" name="product[1]" value="DB000">&nbsp;暂不需要&nbsp;
								</div>
								<hr/>
								<h4>短/彩信包</h4>
								<div class="form-group">
									<input type="radio" name="product[2]" value="DC010">&nbsp;10元包200条&nbsp;
									<input type="radio" name="product[2]" value="DC020">&nbsp;20元包400条&nbsp;
									<input type="radio" name="product[2]" value="DC030">&nbsp;30元包600条&nbsp;
									<input type="radio" name="product[2]" value="DC000">&nbsp;暂不需要&nbsp;
								</div>
								<h4>来电显示</h4>
								<div class="form-group">
									<input type="radio" name="product[3]" value="DD006">&nbsp;6元/月来电显示&nbsp;
									<input type="radio" name="product[3]" value="DD000">&nbsp;暂不需要&nbsp;
								</div>
						</div>
						<div class="form-group">
								<input type="submit" value="确认" class="btn btn-primary btn-block">
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
	<div id="addTemplate">
		<form id="recommendForm">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h5 class="panel-title text-center">客户信息</h5>
				</div>
				<div class="panel-body">
 					<div id="hiddenFields"></div>
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
		</form>
	</div>
	<div id="successTemplate">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h5 class="panel-title text-center">推荐成功</h5>
			</div>
			<div class="panel-body">
				<p>恭喜你，推荐成功！</p>
				<button class="btn btn-primary btn-block back">返回</button>
			</div>
		</div>
	</div>
</div>
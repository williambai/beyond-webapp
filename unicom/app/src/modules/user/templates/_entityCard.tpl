<div>
	<div id="indexTemplate">
		<div class="panel panel-default">
			<div class="pull-right">
				<button class="btn btn-primary search">过滤</button>
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
			<button class="btn btn-success recommend">推荐</button>
		</div>
		<h4>号码：<%= model.cardNo %></h4>
		<p>预存：<%= model.price %>元</p>
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
	<div id="packageTemplate">
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
							<input type="hidden" name="package" value="A">
							<a class="bg-success selectItem"><input type="radio" name="item[]" value="46" class="hidden">&nbsp; 46元套餐</a>&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
							<input type="radio" name="item[]" value="126">&nbsp;126元套餐&nbsp;
							<input type="radio" name="item[]" value="156">&nbsp;156元套餐&nbsp;
							<input type="radio" name="item[]" value="186">&nbsp;186元套餐&nbsp;
							<input type="radio" name="item[]" value="226">&nbsp;226元套餐&nbsp;
							<input type="radio" name="item[]" value="286">&nbsp;286元套餐&nbsp;
							<input type="radio" name="item[]" value="386">&nbsp;386元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
						<div class="form-group">
							<input type="hidden" name="package" value="B">
							<input type="radio" name="item[]" value="46">&nbsp;46元套餐&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
							<input type="radio" name="item[]" value="126">&nbsp;126元套餐&nbsp;
							<input type="radio" name="item[]" value="156">&nbsp;156元套餐&nbsp;
							<input type="radio" name="item[]" value="186">&nbsp;186元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
						<div class="form-group">
							<input type="hidden" name="package" value="C">
							<input type="radio" name="item[]" value="46">&nbsp;46元套餐&nbsp;
							<input type="radio" name="item[]" value="66">&nbsp;66元套餐&nbsp;
							<input type="radio" name="item[]" value="96">&nbsp;96元套餐&nbsp;
						</div>
					</div>
					<div class="tab">
							<h4>全国流量包</h4>
							<input type="hidden" name="package" value="D">
							<div class="form-group">
								<input type="radio" name="chinaData" value="">8元包100MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;16元包300MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;24元包500MB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;48元包1GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;72元包2GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;96元包3GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;120元包4GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;152元包5GB&nbsp;
								<input type="radio" name="chinaData" value="">&nbsp;232元包11GB&nbsp;
							</div>
							<hr/>
							<h4>全国语音包</h4>
							<div class="form-group">
								<input type="radio" name="chinaVoice" value="">32元包200分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;40元包300分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;56元包500分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;112元包1000分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;160元包3000分钟&nbsp;
								<input type="radio" name="chinaVoice" value="">&nbsp;暂不需要&nbsp;
							</div>
							<hr/>
							<h4>短/彩信包</h4>
							<div class="form-group">
								<input type="radio" name="sms" value="">&nbsp;10元包200条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;20元包400条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;30元包600条&nbsp;
								<input type="radio" name="sms" value="">&nbsp;暂不需要&nbsp;
							</div>
							<h4>来电显示</h4>
							<div class="form-group">
								<input type="radio" name="displayNo" value="">&nbsp;6元/月来电显示&nbsp;
								<input type="radio" name="displayNo" value="">&nbsp;暂不需要&nbsp;
							</div>
					</div>
					<div class="form-group">
							<button class="btn btn-primary btn-block" id="packageSelected">确认</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
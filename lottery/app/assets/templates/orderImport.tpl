<div>
<form class="form-inline">
	<div class="form-group">
		<div class="input-group">
			<input type="file" name="filename" class="form-control" placeholder="选择导入文件" />
		</div>
	</div>
	<input type="submit" value="导入" class="btn btn-primary"/>
</form>
</div>
<hr>
<h4>导入文件格式</h4>
<p>文件格式为csv，以下是对每列数据的说明：</p>
<ul>
	<li>姓名</li>
	<li>手机号</li>
	<li>彩票类型</li>
	<li>彩票号码：参考彩票编码规则</li>
	<li>彩票期数：正整数</li>
	<li>是否短信提醒：是/否 </li>
	<li>短信提醒方式：frist/every </li>
</ul>
<div id="result"></div>
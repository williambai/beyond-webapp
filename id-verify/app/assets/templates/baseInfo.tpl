<h4 class="text-center">居民身份基本信息</h4>
<hr/>
<div class="pull-right times"></div>
<div class="price"></div>
<form class="form-horizontal">
	<label></label>
	<input name="card_name" type="text" placeholder="姓名" class="form-control">
	<span class="help-block"></span>
	<input name="card_id" type="text" placeholder="身份证号码" class="form-control">
	<span class="help-block"></span>
	<br>
	<input type="submit" class="btn btn-primary btn-block" value="查&nbsp;&nbsp;询" />
</form>
<br>
<% if(person.credential == true){ %>
<table class="table table-striped">
	<thead>
		<th>序号</th>
		<th>项目</th>
		<th>结果</th>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>姓名</td>
			<td><%= person.result_xm %></td>
		</tr>
		<tr>
			<td>5</td>
			<td>曾用名</td>
			<td><%= person.result_cym %></td>
		</tr>
		<tr>
			<td>2</td>
			<td>身份证号码</td>
			<td><%= person.result_gmsfhm %></td>
		</tr>
		<tr>
			<td>3</td>
			<td>性别</td>
			<td><%= person.result_sex %></td>
		</tr>
		<tr>
			<td>4</td>
			<td>出生日期</td>
			<td><%= person.result_csrq %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>婚姻状况</td>
			<td><%= person.result_hyzk %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>文化程度</td>
			<td><%= person.result_whcd %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>所属省市县区</td>
			<td><%= person.result_ssssxq %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>住址</td>
			<td><%= person.result_zz %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>服务处所</td>
			<td><%= person.result_fwcs %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>出生地</td>
			<td><%= person.result_csdssx %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>注销状态</td>
			<td><%= person.result_zt %></td>
		</tr>
		<tr>
			<td>1</td>
			<td>注销标识</td>
			<td><%= person.result_zxbs %></td>
		</tr>
	</tbody>
</table>
<% }else if(person.credential == false){ %>
	<p>查无此人。</p>
<% } %>



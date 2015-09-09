<div class="pull-right">
	<button class="btn btn-warning print">打印</button>
</div>
<p>&nbsp;</p>
<hr>
<h4>甲方：<%= account.username %></h4>
<h4>乙方：<%= order.customer.username %></h4>

<p>
	甲方在提供 <u></u>
	服务时，赠予乙方以下增值服务：
</p>

<p>彩票名称：<%= order.game.name %></p>
<p>彩票号码：<%= order.game.content %></p>
<p>连续&nbsp;<%= order.game.periods %>&nbsp;期</p>
<p>合计消费：<%= (2 * Number(order.game.periods)).toFixed(2) %>（积分或元）。</p>
乙方同意并接受以上服务。
<p>乙方（签字）：</p>
<p>年   月   日</p>
<hr>
<h3 class="">客户信息</h3>
<p>*姓名：</p>
<p>*证件号码：                               （身份证）</p>
<p>*手机号码：                               （短信提醒）</p>
<hr>
<h3>银行信息</h3>
<p>（金额小于500元的直接汇入客户银行账号）</p>
<p>开户银行：</p>
<p>开户银行地址：</p>
<p>客户姓名：（必须与上述“姓名”一致，否则无法转账）</p>

<p>客户账号：</p>
<hr>
<h3>兑奖凭证</h3>

<p>姓名：身份证号：</p>
<p>类型	号码	档期</p>
		

<p>兑奖方法：</p>

<p>中奖金额小于500元，可选择以下任一方式兑奖：</p>
<ol>
<li>本人携带身份证及本单到甲方所在地兑奖；</li>
<li>提供银行账号，通过银行转账兑付（如转账过程中产生费用，须在中奖金额中扣除）。</li>
</ol>
<p>中奖金额大于500元，请本人携带身份证及本单到甲方所在地兑奖。</p>

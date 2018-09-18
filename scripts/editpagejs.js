
var vNo = null;
var AddElement = document.getElementById('btnaddContent');
AddElement.addEventListener('click',function(e){
	//alert(123);
	var mytable = document.querySelector('.content table tbody');
	if(vNo == null)
	{
		//获取最新编号
		var myrows = mytable.querySelectorAll('tr');
		if(myrows.length > 1)
		{
			var lasttrele = myrows[myrows.length -1];
			vNo = lasttrele.firstElementChild.innerHTML;
		}
		else
		{
			vNo = 0;
		}

	}
	var itemTemplate = '' +
	'<tr>'+
	'<td>'+ (++vNo)+'</td>'+
	'<td><input type="text" name="tb_displayName" onchange="changeValue(this)"></td>'+
	'<td><input type="text" name="tb_valueName" onchange="changeValue(this)"></td>'+
	'<td><input class="removerow" type="button" name="" value="-"></td>'+
	'</tr>';
	mytable.innerHTML += itemTemplate;

	$(".removerow").click(function(e){
		//var parent = elementClosest(e.currentTarget,"tbody");
		var elem = elementClosest(e.currentTarget,"tr");
		if(elem != null)
		{
			elem.parentNode.removeChild(elem);
			//parent.removeChild(elem);
		}
	});
});

$(".removerow").click(function(e){
	//var parent = elementClosest(e.currentTarget,"tbody");
	var elem = elementClosest(e.currentTarget,"tr");
	if(elem != null)
	{
		elem.parentNode.removeChild(elem);
		//parent.removeChild(elem);
	}
});

function elementClosest(element, selector) {

	if (window.Element && !Element.prototype.closest) {
		var isMatch = elementMatches(element, selector);
		while (!isMatch && element && element !== document) {
			element = element.parentNode;
			isMatch = element && element !== document && elementMatches(element, selector);
		}
		return element && element !== document ? element : null;
	}
	else {
		return element.closest(selector);
	}

}

function elementMatches(element, selector) {

	var p = Element.prototype;
	return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);

}

function changeValue(obj){
	$(obj).attr("value",$(obj).val());
}

function changeContenttype(obj)
{
	var selectedvalue = obj.selectedOptions[0].value;
	if(selectedvalue == "0")
	{
		$("li.li_Content").css("display",'none');
	}
	else
	{
		$("li.li_Content").css("display",'block');
	}
}

function init()
{
	$('#myeditcontent li input[name=IsRequired][value=0]').attr('checked','checked');
	$('#myeditcontent li input[name=IsNumber][value=0]').attr('checked','checked');
	$('#myeditcontent li input[name=maxlength]').attr('value','');
	var itemTemplate = '' +
	'<tr class="head">'+
		'<td width="15%">编号</td>'+
		'<td width="40%">显示名称</td>'+
		'<td width="30%">值名称</td>' +
		'<td width="15%">操作</td>'+
	'</tr>';
	document.querySelector('.content table tbody').innerHTML = itemTemplate;
	vNo = 0;
}

function showdata(element,itemno)
{
	init();
	if(element == null)
	{
		return;
	}
	if(itemno == 'first')
	{
		$('#myeditcontent').attr("mylevel",'1');
		var vTitlename = element.querySelector('h3').innerText;
		$('#tb_ContentTitle').attr('value',vTitlename);
		$("#payment li").css("display",'none');
		$("#payment li.first").css("display",'block');
	}
	else if(itemno == 'second')
	{
		$('#myeditcontent').attr("mylevel",'2');
		var vContenttype = $(element).attr('contenttype');
		var vTitlename = element.querySelector('.content-title').innerText.replace(':','');
		var vIsrequired = $(element).attr('isrequired');
		var vIsnum = $(element).attr('isNum');
		var vMaxlength = $(element).attr('maxlength');
		$("#payment li").css("display",'none');
		$("#payment li.second").css("display",'block');
		$('#tb_ContentTitle').attr("value",vTitlename);

		$("#contenttype").val(vContenttype);
		$("#contenttype").change();

      	// 0 文本框 1 下拉 2 单选 3 多选 4日历
      	if(vIsrequired != null){
      		var vparm = "#payment li input[name=IsRequired][value='{0}']".format(vIsrequired);
      		$(vparm).attr("checked",'checked');
      	}

      	if(vIsnum != null){
      		var vparm1 = "#payment li input[name=IsNumber][value='{0}']".format(vIsnum);
      		$(vparm1).attr("checked",'checked');
      	}

      	if(vMaxlength != null){
      		$("#payment li input[name=maxlength]").attr("value",vMaxlength);
      	}

        //加载多项目数据
        var items = [];
        if(vContenttype == '1'){
        	var itemElements = $(element).find('option');
        	for(var i=0 ; i<itemElements.length ; i++){
        		content = new Object();
        		content.displayvalue = itemElements[i].innerText;
        		content.keyvalue = $(itemElements[i]).attr('value');
        		items.push(content);
        	}
        }
        else if(vContenttype == '3' || vContenttype == '2')
        {
        	//获取多个项目 displayvalue keyvalue
        	var itemElements = $(element).find('label');
        	for(var i=0 ; i<itemElements.length ; i++){
        		content = new Object();
        		content.displayvalue = itemElements[i].innerText;
        		content.keyvalue = $(itemElements[i].querySelector('input')).attr('value');
        		items.push(content);
        	}
        }

	    if(items.length > 0 ){
	    	var mytable = document.querySelector('.content table tbody');
	    	var addhtml = "";
	    	for(var i=0 ; i<items.length ; i++){
	    		var itemTemplate = '' +
	    		'<tr>'+
	    		'<td>'+ (++vNo)+'</td>'+
	    		'<td><input type="text" name="tb_displayName" onchange="changeValue(this)" value="'+items[i].displayvalue +'"></td>'+
	    		'<td><input type="text" name="tb_valueName" onchange="changeValue(this)" value="'+items[i].keyvalue +'"></td>'+
	    		'<td><input class="removerow" type="button" name="" value="-"></td>'+
	    		'</tr>';
	    		addhtml += itemTemplate;}
	    	mytable.innerHTML += addhtml;
	    }

	}
}
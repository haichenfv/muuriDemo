document.addEventListener('DOMContentLoaded', function () {
	var vNo = null;
	var AddElement = document.getElementById('btnadd');
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
			'<td><input type="text" name=""></td>'+
			'<td><input type="text" name=""></td>'+
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
})
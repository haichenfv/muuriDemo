// 
//初始化全局变量
// 
var grid0 = null;
var grid1 = null;
var grid2 = null;
var allgrid = [];       //保存所有的二级grid
var movefromelem = null;
var gridgroup = document.querySelector('.grid-Group');
var gridElement0 = document.getElementById('grid-0');
var gridElement1 = document.getElementById('grid-1');
var gridElement2 = document.getElementById('grid-2');
var gridnoid = 2;
var elem = null;

//加载完成事件
document.addEventListener('DOMContentLoaded', function () {
  initGrid();
});

// 
// 页面操作事件
// 

//按钮操作
$('#btnadd').click(addItems);
$('#btnaddgrid').click(addGridItems);

//一级grid
$(gridgroup).click(function(e){
  if(elementMatches(e.target,'.close')){
    if (confirm("是否要删除当前行!") == true){
      removefirstItem(e);
    } 
  }
  else if(elementMatches(e.target,'.item-header h3')){
    selectedfirstItem(e);
  }
  else if(elementMatches(e.target,'.item-header .edit')){
    elem = elementClosest(e.target, '.item-header');
    ShoweditPage();
    showdata(elem,'first');
  }

});

//二级gird 双击进入编辑
$('.grid-second .content-title').dblclick(function(e){
  ShoweditPage();
  elem = elementClosest(e.target, '.item-content');
  showdata(elem,'second');
});

// 
//方法
//

// 添加一级grid 
function addGridItems(){
  var itemElem = document.createElement('div');
  var gridno = 'grid-' + (++gridnoid);
  var itemTemplate = '' +
  '<div class="item">' +
  '<div class="item-header">'+
  '<h3>标题</h3>'+
  '<div class="action">'+
  '<a href="javascript:void(0);" class="edit" title="编辑"></a>'+
  '<a href="javascript:void(0);" class="close" title="关闭"></a>'+
  '</div>'+
  '</div>'+
  '<div class="item-content">' + 
  '<div id="'+ gridno +'"'+' class="grid grid-second">' +
  '<div class="item">'+
  '<div class="item-content">'+
  '<div class="content-title">新增字段:</div>'+
  '<input class="content-Value" type="text" name="">'+
  '</div>'+
  '</div>'+
  '</div>'+
  '</div>' +
  '</div>';

  itemElem.innerHTML = itemTemplate;
  grid0.add([itemElem.firstChild]);

  //初始化grid
  var NewgridElement = document.getElementById(gridno);
  var varname="grid"+ gridnoid;
  window[varname] = null; 
  varname = new Muuri(NewgridElement, {
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.item-content .content-title'
    },
    dragSort: getAllGrids
  });

  varname.on('receive',gridreceive);
  varname.on('dragReleaseEnd',griddragReleaseEnd);

  allgrid.push(varname);

  freshbinding();
}

//新增字段
function addItems() {
  //找到选中的grid
  var selectItem = document.querySelector(".item.select");
  var selectelement = document.querySelector('.item.select .grid-second');
  if(selectelement != null)
  {
    var gridid = parseInt(selectelement.getAttribute('id').split('-')[1]);
    if(allgrid[gridid-1] != null)
    {
      var newElems = generateElements(1);
      var itemheightpro = selectItem.offsetHeight;
      allgrid[gridid-1].add(newElems);
      var itemheightchange = selectItem.offsetHeight - itemheightpro;
      var item = grid0.getItems([selectItem])[0];
      if(itemheightchange != 0)
      {
        item._height += itemheightchange;
      }
      grid0.layout();
    }

    freshbinding();
  }
  else{
    alert('请选定需要添加的段落！');
  }
}

//新增字段2
function addItems2() {
  //找到选中的grid
  // var selectelement = document.querySelector('.item.select .grid-second');
  // if(selectelement != null)
  // {
  //   var gridid = parseInt(selectelement.getAttribute('id').split('-')[1]);
  //   var itemElem = document.createElement('div');
  //   var itemTemplate = '' +
  //   '<div class="item" style="width: 400px">' +
  //   '<div class="item-content">'+
  //   '<div class="content-title">姓名:</div>'+
  //   '<input class="content-Value" type="text" name="">'+
  //   '</div>' +
  //   '</div>';
  //   itemElem.innerHTML = itemTemplate;
  //   if(allgrid[gridid-1] != null)
  //   {
  //     allgrid[gridid-1].add([itemElem.firstChild]);
  //   }
  // }

  //模拟修改二级项目
  var vSelecteditem = document.getElementById("item123");
  var vSelecteditem2 = document.getElementById("cb_Car");
  var vLengthpro = vSelecteditem.offsetWidth;
  var itemTemplateCar = '' +
  '<label for="cb4"><input id="cb4" type="checkbox" checked="checked" name="Car" value="audi" />bulabulabula</label>';
  vSelecteditem2.innerHTML += itemTemplateCar;
  var lengthchanged = vSelecteditem.offsetWidth - vLengthpro;
  var item = grid2.getItems([vSelecteditem])[0];
  item._width += lengthchanged;
  //grid2.remove([v123],{removeElements: true});
  grid2.layout();
}

function getAllGrids(item) {
  return allgrid;
}

function initGrid() {
  grid0 = new Muuri(gridElement0, {
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.item-header'
    }
  });

  grid1 = new Muuri(gridElement1, {
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.item-content .content-title'
    },
    dragSort: getAllGrids
  });

  grid1.on('receive',gridreceive);
  grid1.on('dragReleaseEnd',griddragReleaseEnd);

  grid2 = new Muuri(gridElement2, {
    dragEnabled: true,
    dragStartPredicate: {
      handle: '.item-content .content-title'
    },
    dragSort: getAllGrids
  });

  grid2.on('receive',gridreceive);
  grid2.on('dragReleaseEnd',griddragReleaseEnd);

  allgrid = [grid1,grid2];
}

function gridreceive(data)
{
  movefromelem = elementClosest(data.fromGrid._element,".grid-first .item");
}

function griddragReleaseEnd(item){
  //放置的grid
  var elemsecond = elementClosest(item._element,".grid-second");
  var elemfirst = elementClosest(elemsecond,".grid-first .item");
  var parentitem = grid0.getItems([elemfirst])[0];
  parentitem._height = elemfirst.offsetHeight;
  //来源的grid
  if(movefromelem != null)
  {
    var fromparentitem = grid0.getItems([movefromelem])[0];
    fromparentitem._height = movefromelem.offsetHeight;
  }
  grid0.layout();
}

//生成元素
function generateElements(amount) {
  var ret = [];
  for (var i = 0; i < amount; i++) {
    ret.push(generateElement());
  }

  return ret;
}
function generateElement() {

  var itemElem = document.createElement('div');
  var classNames = 'item';
  var itemTemplate = '' +
  '<div class="' + classNames +'">' +
  '<div class="item-content" contenttype="0">' +
  '<div class="content-title">新增字段: </div>' +
  '<input class="content-Value" type="text" name="">' +
  '</div>' +
  '</div>';

  itemElem.innerHTML = itemTemplate;
  return itemElem.firstChild;
}

function elementMatches(element, selector) {
  var p = Element.prototype;
  return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);
}

function removefirstItem(e) {
  var elem = elementClosest(e.target, '.item');
  grid0.hide(elem, {onFinish: function (items) {
    var item = items[0];
    grid0.remove(item, {removeElements: true});
  }});
}

function removesecondItem(elem) {
  var selectedelem = elementClosest(elem, '.item');
  var selectedgrid = elementClosest(elem, '.grid-second');
  var selectedfirstelem = elementClosest(selectedgrid, '.item');
  if(selectedgrid != null)
  {
    var gridid = parseInt(selectedgrid.getAttribute('id').split('-')[1]);
    var vGrid = allgrid[gridid-1];
    if( vGrid != null){
      var itemheightpro = selectedfirstelem.offsetHeight;
      vGrid.hide(selectedelem, {onFinish: function (items) {
        var item = items[0];
        vGrid.remove(item, {removeElements: true});
      }});
      var itemheightchange = selectedfirstelem.offsetHeight - itemheightpro;
      var item = grid0.getItems([selectedfirstelem])[0];
      if(itemheightchange != 0)
      {
        item._height += itemheightchange;
      }
      grid0.layout();
    }
  }
}

function selectedfirstItem(e) {
  grid0.getItems().forEach(function (item, i) {
    item.getElement().classList.remove('select');
  });

  var elem = elementClosest(e.target, '.grid-first .item');
  if(!elem.classList.contains('select'))
  {
    elem.classList.add('select');
  }
  else
  {
    elem.classList.remove('select');
  }
}

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

//显示编辑页面数据
function ShoweditPage(){
  centerPopup();
  //document.getElementById("sonform").innerHTML = '<object type="text/html" data="editPage.html" width="100%" height="100%"></object>';
  //$('#sonform').load('editPage.html');
  $("#backgroundPopup").css({"opacity": "0.7"});
  $("#backgroundPopup").fadeIn("slow");
  $("#popupContact").fadeIn("slow");

  //self.location.reload();
  //$("#sonform").load(location.href+"#sonform");
}

//保存编辑页面数据
$('#popupContactSave').click(function(){
  if(elem != null)
  {
    var vLevel = $('#myeditcontent').attr("mylevel");
    if( vLevel == '1') //以及grid编辑
    {
      var vTitlename = $('#tb_ContentTitle').attr('value');
      var result = CheckValue(vTitlename,'标题名称');
      if(!result){
        return;
      } 
      $(elem).find('h3')[0].innerHTML = vTitlename; //elem.querySelector('h3');
    }
    else if(vLevel == '2')
    {
      var vContenttype = $('#contenttype option:selected').val();
      var vTitlename = $('#tb_ContentTitle').attr('value');
      var vIsRequired = $('#payment li input[name=IsRequired][checked=checked]').attr('value');
      var vIsnum = $('#payment li input[name=IsNumber][checked=checked]').attr('value');
      var vMaxlength = $("#payment li input[name=maxlength]").attr("value");
      var itemTemplate;
      var Iscontinueedit = false;
      var myoptions = '';
      var vOptions = [];
      if(vContenttype =='1'|| vContenttype == '2'||vContenttype =='3')
      {
        $('.content table tr').not('.head').map(function(item,index,array){
          var content = new Object();
          content.index = index.firstChild.innerText;
          content.displayvalue = $($(index).find('input[name=tb_displayName]')[0]).attr('value');
          content.keyvalue = $($(index).find('input[name=tb_valueName]')[0]).attr('value');
          vOptions.push(content);
        });
      }
      switch(vContenttype)
      {
        case '0':
        itemTemplate = ''+
        '<div class="item-content" contenttype="0" isrequired="'+ vIsRequired +'" isNum="'+vIsnum +'" maxlength="'+vMaxlength+'">'+
        '<div class="content-title">'+ vTitlename +': </div>' +
        '<input class="content-Value" type="text" name="">' +
        '</div>';
        break;
        case '1':
        vOptions.map(function(item){
          if(item.displayvalue == '' || item.keyvalue == '')
          {
            alert('{0}行数据不能为空，请检查！'.format(item.index));
            Iscontinueedit = true;
            return;
          }
          myoptions += '<option value="{0}">{1}</option>'.format(item.keyvalue,item.displayvalue);
        });

        itemTemplate = ''+
        '<div class="item-content" contenttype="1" isrequired="'+ vIsRequired +'" isNum="'+vIsnum +'" maxlength="'+vMaxlength+'">'+
        '<div class="content-title">'+ vTitlename +': </div>'+
        '<select class="content-Value">'+myoptions+
        '</select>'+
        '</div>';
        break;
        case '2':
        var radioname = 'rb_'+ uuid(8,16);
        vOptions.map(function(item){
          if(item.displayvalue == '' || item.keyvalue == '')
          {
            alert('{0}行数据不能为空，请检查！'.format(item.index));
            Iscontinueedit = true;
            return;
          }
          var radiono = radioname + '_{0}'.format(item.index);
          myoptions += '<label for="{0}"><input id="{0}" type="radio" name="{1}" value="{2}" />{3}</label>'.format(radiono,radioname,item.keyvalue,item.displayvalue);
        });

        itemTemplate = ''+
        '<div class="item-content" contenttype="2" isrequired="'+ vIsRequired +'" isNum="'+vIsnum +'" maxlength="'+vMaxlength+'">'+
        '<div class="content-title">'+ vTitlename +': </div>'+
        '<div class="content-radio">'+ myoptions +
        '</div>'+
        '</div>';
        break;
        case '3':
        var cbname = 'cb_'+ uuid(8,16);
        vOptions.map(function(item){
          if(item.displayvalue == '' || item.keyvalue == '')
          {
            alert('{0}行数据不能为空，请检查！'.format(item.index));
            Iscontinueedit = true;
            return;
          }
          var cbno = cbname + '_{0}'.format(item.index);
          myoptions += '<label for="{0}"><input id="{0}" type="checkbox" name="{1}" value="{2}" />{3}</label>'.format(cbno,cbname,item.keyvalue,item.displayvalue);
        });

        itemTemplate = ''+
        '<div class="item-content" contenttype="3" isrequired="'+ vIsRequired +'" isNum="'+vIsnum +'" maxlength="'+vMaxlength+'">'+
        '<div class="content-title">'+ vTitlename +': </div>'+
        '<div id="" class="content-checkbox">'+myoptions+
        '</div>'+
        '</div>';
        break;
        case '4':
        var vTimetype = $('#datetype option:selected').val();
        itemTemplate = ''+
        '<div class="item-content" contenttype="4" isrequired="'+ vIsRequired +'">'+
        '<div class="content-title">'+ vTitlename +': </div>'+
        '<input class="content-Date" type="'+ vTimetype +'" value="2015-09-24"/>'+
        '</div>';
        break;
      }

      elem.outerHTML = itemTemplate;
    }
  }
  if(!Iscontinueedit)
  {
    elem = null;
    disablePopup();
    freshbinding();
  }
});

//
//window 右击目录
//
window.oncontextmenu = function(e){
  e.preventDefault();
}
window.onclick = menuclose;
function menuclose()
{
  document.querySelector('#mymenu').style.width=0;
}
var currentelement = null;
$('.grid-second .item-content').mousedown(function(e){
  if(e.which == 3){
    var menu=document.querySelector("#mymenu");
    menu.style.left=e.clientX+'px';
    menu.style.top=e.clientY+'px';
    menu.style.width='60px';
    currentelement = elementClosest(e.target, '.item-content');
  }
});

$('.menuitem').click(function(e){
  if(currentelement != null)
  {
    var vAction = $(this).attr('data-item');
    if( vAction == '0'){
      alert('您选择查看信息！');
    }
    else if( vAction == '1'){
      ShoweditPage();
      showdata(currentelement,'second');
    }
    else if( vAction == '2'){
      if (confirm("是否要删除当前选中字段!") == true){
        removesecondItem(currentelement)
      }
    }
  }
  menuclose();
});


$('#popupContactClose').click(function () {
  disablePopup();
});
$("#backgroundPopup").click(function () {
    //disablePopup();
});

function disablePopup() {
  $("#backgroundPopup").fadeOut("slow");
  $("#popupContact").fadeOut("slow");
}

function centerPopup() {
  //获取系统变量
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var popupHeight = $("#popupContact").height();
  var popupWidth = $("#popupContact").width();
  //居中设置   
  $("#popupContact").css({
    "position": "absolute",
    "top": windowHeight / 2 - popupHeight / 2,
    "left": windowWidth / 2 - popupWidth / 2
  });
  //以下代码仅在IE6下有效  
  $("#backgroundPopup").css({"height": windowHeight});
}


String.prototype.format = function() {
 if(arguments.length == 0) return this;
 var param = arguments[0];
 var s = this;
 if(typeof(param) == 'object') {
  for(var key in param)
   s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
  return s;
 } else {
  for(var i = 0; i < arguments.length; i++)
   s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
  return s;
 }
}

// var options = {items:[
//   {text: '查看', href: '#'},
//   {text: '编辑', onclick: function(e) {
//     var v123 = '123';
//     alert("你点击了第二个链接")}},
//   {divider: true},
//   {text: '删除', href:'#'}]};
// $('.grid-second .item-content .content-title').contextify(options);

function CheckValue(contentvalue,titlename){
  if(contentvalue == null || contentvalue == '')
  {
    alert('{0} 为空！'.format(titlename));
    return false;
  }
  return true;
}

function freshbinding()
{
  //绑定事件
  $('.grid-second .item-content').mousedown(function(e){
    if(e.which == 3){
      var menu=document.querySelector("#mymenu");
      menu.style.left=e.clientX+'px';
      menu.style.top=e.clientY+'px';
      menu.style.width='60px';
      currentelement = elementClosest(e.target, '.item-content');
    }
  });

  //二级gird 双击进入编辑
  $('.grid-second .content-title').dblclick(function(e){
    ShoweditPage();
    elem = elementClosest(e.target, '.item-content');
    showdata(elem,'second');
  });
}

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}


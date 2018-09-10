document.addEventListener('DOMContentLoaded', function () {
  var grid0 = null;
  var grid1 = null;
  var grid2 = null;
  var allgrid = [];       //保存所有的二级grid
  var movefromelem = null;
  var gridgroup = document.querySelector('.grid-Group');
  var gridElement0 = document.getElementById('grid-0');
  var gridElement1 = document.getElementById('grid-1');
  var gridElement2 = document.getElementById('grid-2');

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

  //receive grid
  function gridreceive(data)
  {
    movefromelem = elementClosest(data.fromGrid._element,".grid-first .item");
  }

  //放置好事件
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

  //新增字段
  var AddElement = document.getElementById('btnadd');
  AddElement.addEventListener('click',addItems);
  var AddElement2 = document.getElementById('btnadd2');
  AddElement2.addEventListener('click',addItems2);

  //一级grid 删除事件
  gridgroup.addEventListener('click',function(e){
    if(elementMatches(e.target,'.close')){
      removefirstItem(e);
    }
  });

  

  //一级grid 选择事件
  gridgroup.addEventListener('click',function(e){
    if(elementMatches(e.target,'.item-header h3')){
      selectedfirstItem(e);
    }
  });

  //新增段落
  var AddGrid = document.getElementById('btnaddgrid');
  AddGrid.addEventListener('click',addGridItems);

  // 添加一级grid 
  var gridnoid = 2;
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
    //     '<div class="item" style="width: 400px">' +
    //       '<div class="item-content">'+
    //         '<div class="content-title">姓名:</div>'+
    //         '<input class="content-Value" type="text" name="">'+
    //       '</div>' +
    //     '</div>';
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
        '<div class="' + classNames +'" >' +
          '<div class="item-content">' +
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

  window.oncontextmenu=function(e){
    e.preventDefault();

    var menu=document.querySelector("#menu");
    menu.style.left=e.clientX+'px';
    menu.style.top=e.clientY+'px';
    menu.style.width='125px';
  }

  window.onclick=function(e){
　　  document.querySelector('#menu').style.width=0;
  }

  var vEditGrid = document.getElementById('btnedit');
  vEditGrid.addEventListener('click',editgrid);

  function editgrid()
  {
    centerPopup();
    $("#backgroundPopup").css({"opacity": "0.7"});
    $("#backgroundPopup").fadeIn("slow");
    $("#popupContact").fadeIn("slow");
  }

  $('#popupContactClose').click(function () {
    disablePopup();
  });

  function disablePopup() {
    $("#backgroundPopup").fadeOut("slow");
    $("#popupContact").fadeOut("slow");
  };

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
  };

  $("#backgroundPopup").click(function () {
    //disablePopup();
  });

  var elem = null;
  $('.grid-second .item').dblclick(function(e){
    editgrid();
    elem = e.currentTarget;
    showdata(elem,'second');
  });

  //一级grid 编辑事件
  $(".item-header .edit").click(function (e) {
    elem = elementClosest(e.target, '.item-header');
    editgrid();
    showdata(elem);
  });

  function showdata(element,itemno)
  {
    if(element == null)
    {
      return;
    }
    if(itemno == 'first')
    {
      var vTitlename = element.querySelector('h3').innerText;
      $('input#name').attr("value",vTitlename);
    }
    else if(itemno == 'second')
    {
      var vContenttype = $(element).find('.item-content').attr('contenttype');
      var vTitlename = element.querySelector('.content-title').innerText.replace(':','');
      $('input#name').attr("value",vTitlename);

    }
    
  }

  //保存
  $('#popupContactSave').click(function(){
    if(elem != null)
    {
      elem.querySelector('h3').innerHTML = $('input#name').attr('value');
    }
    elem = null;
    disablePopup();
  });

  initGrid();
});




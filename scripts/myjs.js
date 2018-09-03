document.addEventListener('DOMContentLoaded', function () {
  var grid0 = null;
  var grid1 = null;
  var grid2 = null;
  //var grid3 = null;
  var allgrid = [];
  //var docElem = document.documentElement;
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
      },
      layout:function(items, gridWidth, gridHeight){
        var layout = {
        // The layout item slots (left/top coordinates).
        slots: [],
        // The layout's total width.
        width: 0,
        // The layout's total height.
        height: 0,
        // Should Muuri set the grid's width after layout?
        setWidth: true,
        // Should Muuri set the grid's height after layout?
        setHeight: true
        };

        // Calculate the slots.
        var item;
        var m;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        for (var i = 0; i < items.length; i++) {
          item = items[i];
          x = 0;
          y += h;
          m = item.getMargin();
          w = item.getWidth() + m.left + m.right;
          h = item.getHeight() + m.top + m.bottom;
          layout.slots.push(x, y);
        }

        // Calculate the layout's total width and height. 
        layout.width = x + w;
        layout.height = y + h;

        return layout;
      }
    });

    grid1 = new Muuri(gridElement1, {
      dragEnabled: true,
      dragStartPredicate: {
        handle: '.item-content .content-title'
      },
      dragSort: getAllGrids
    });

    grid2 = new Muuri(gridElement2, {
      dragEnabled: true,
      dragStartPredicate: {
        handle: '.item-content .content-title'
      },
      dragSort: getAllGrids
    });

    allgrid = [grid1,grid2];
  }

  //新增字段
  var AddElement = document.getElementById('btnadd');
  AddElement.addEventListener('click',addItems);
  var AddElement2 = document.getElementById('btnadd2');
  AddElement2.addEventListener('click',addItems2);

  //一级grid 删除事件
  gridgroup.addEventListener('click',function(e){
    if(elementMatches(e.target,'.close')){
      removeItem(e);
    }
  });

  //一级grid 选择事件
  gridgroup.addEventListener('click',function(e){
    if(elementMatches(e.target,'.item-header h3')){
      selectItem(e);
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
              '<div class="close"></div>'+
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
    var ret = [];
    ret.push(itemElem.firstChild);

    grid0.add(ret);

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
      var newElems = generateElements(1);
      //var selectegrid = window[gridid];
      //selectegrid.add(newElems);
      if(allgrid[gridid-1] != null)
      {
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

  function removeItem(e) {
    var elem = elementClosest(e.target, '.item');
    grid0.hide(elem, {onFinish: function (items) {
      var item = items[0];
      grid0.remove(item, {removeElements: true});
    }});
  }

  function selectItem(e) {

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

  function grid0layout(items, gridWidth, gridHeight)
  {
    var layout = {
      // The layout item slots (left/top coordinates).
      slots: [],
      // The layout's total width.
      width: 0,
      // The layout's total height.
      height: 0,
      // Should Muuri set the grid's width after layout?
      setWidth: true,
      // Should Muuri set the grid's height after layout?
      setHeight: true
    };
  }

  initGrid();
});




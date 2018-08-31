document.addEventListener('DOMContentLoaded', function () {
  var grid0 = null;
  var grid1 = null;
  var grid2 = null;
  //var docElem = document.documentElement;
  var gridgroup = document.querySelector('.grid-Group');
  var gridElement0 = document.getElementById('grid-0');
  var gridElement1 = document.getElementById('grid-1');
  var gridElement2 = document.getElementById('grid-2');

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
      dragSort: function () {
        return [grid1,grid2];
      }
    });

    grid2 = new Muuri(gridElement2, {
      dragEnabled: true,
      dragStartPredicate: {
        handle: '.item-content .content-title'
      },
      dragSort: function () {
        return [grid1,grid2];
      }
    });
  }

  //新增字段
  var AddElement = document.getElementById('btnadd');
  AddElement.addEventListener('click',addItems);

  //一级grid 删除事件
  gridgroup.addEventListener('click',function(e){
    if(elementMatches(e.target,'.close')){
      removeItem(e);
    }
  });

  //新增段落
  var AddGrid = document.getElementById('btnaddgrid');
  AddGrid.addEventListener('click',addGridItems);

  // 添加一级grid 
  var gridnoid = 0;
  function addGridItems(){
    var itemElem = document.createElement('div');
    var gridno = 'grid-' + (gridnoid + 1);
    var itemTemplate = '' +
        '<div class="item" >' +
          '<div class="item-header>"'+
            '<h3>标题</h3>'+
            '<div class="action">'+
            '</div>'+
          '</div>'+
          '<div class="item-content">' + 
            '<div class="grid grid-second '+  +'">' +
            '</div>'+
          '</div>' +
        '</div>';

    itemElem.innerHTML = itemTemplate;
    var ret = [];
    ret.push(itemElem.firstChild);
  }

  function addItems() {
    var newElems = generateElements(1);
    grid1.add(newElems);
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

  initGrid();
});




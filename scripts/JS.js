var grid1 = new Muuri('.grid-1', 
  { dragEnabled: true,
    dragContainer: document.body,
    dragSort: function () {
      return [grid1, grid2]
    }
  });
var grid2 = new Muuri('.grid-2', 
  { dragEnabled: true,
    dragContainer: document.body,
    dragSort: function () {
      return [grid1, grid2]
    }});

var itemContainers = [].slice.call(document.querySelectorAll('.board-column-content'));
var columnGrids = [];
var boardGrid;

// Define the column grids so we can drag those
// items around.
itemContainers.forEach(function (container) {

  // Instantiate column grid.
  var grid = new Muuri(container, {
    items: '.board-item',
    layoutDuration: 400,
    layoutEasing: 'ease',
    dragEnabled: true,
    dragSort: function () {
      return columnGrids;
    },
    dragSortInterval: 0,
    dragContainer: document.body,
    dragReleaseDuration: 400,
    dragReleaseEasing: 'ease'
  })
  .on('dragStart', function (item) {
    // Let's set fixed widht/height to the dragged item
    // so that it does not stretch unwillingly when
    // it's appended to the document body for the
    // duration of the drag.
    item.getElement().style.width = item.getWidth() + 'px';
    item.getElement().style.height = item.getHeight() + 'px';
  })
  .on('dragReleaseEnd', function (item) {
    // Let's remove the fixed width/height from the
    // dragged item now that it is back in a grid
    // column and can freely adjust to it's
    // surroundings.
    item.getElement().style.width = '';
    item.getElement().style.height = '';
    // Just in case, let's refresh the dimensions of all items
    // in case dragging the item caused some other items to
    // be different size.
    columnGrids.forEach(function (grid) {
      grid.refreshItems();
    });
  })
  .on('layoutStart', function () {
    // Let's keep the board grid up to date with the
    // dimensions changes of column grids.
    boardGrid.refreshItems().layout();
  });

  // Add the column grid reference to the column grids
  // array, so we can access it later on.
  columnGrids.push(grid);

});

// Instantiate the board grid so we can drag those
// columns around.
boardGrid = new Muuri('.board', {
  layoutDuration: 400,
  layoutEasing: 'ease',
  dragEnabled: true,
  dragSortInterval: 0,
  dragStartPredicate: {
    handle: '.board-column-header'
  },
  dragReleaseDuration: 400,
  dragReleaseEasing: 'ease'
});

var AddElement = document.querySelector('.btn'); //document.getElementById('Add');
AddElement.addEventListener('click',addItems);


function addItems() {


    // Generate new elements.
    var newElems = generateElements(1);
    //alert('123');
    // Set the display of the new elements to "none" so it will be hidden by
    // default.
    // newElems.forEach(function (item) {
    //   item.style.display = 'none';
    // });

    // Add the elements to the grid.
    grid1.add(newElems);
  }

var uuid = 0;
var filterOptions = ['red', 'blue', 'green'];
  function generateElements(amount) {

    var ret = [];

    for (var i = 0; i < amount; i++) {
      ret.push(generateElement(
        ++uuid,
        uuid+1,
        getRandomItem(filterOptions),
        getRandomInt(1, 2),
        getRandomInt(1, 2)
        ));
    }

    return ret;

  }

  function generateElement(id, title, color, width, height) {

    var itemElem = document.createElement('div');
    var classNames = 'item h' + height + ' w' + width + ' ' + color;
    var itemTemplate = '' +
        '<div class="' + classNames + '" data-id="' + id + '" data-color="' + color + '" data-title="' + title + '">' +
          '<div class="item-content">' +
            '<div class="card">' +
              '<div class="card-id">' + id + '</div>' +
              '<div class="card-title">' + title + '</div>' +
              '<div class="card-remove"><i class="material-icons">&#xE5CD;</i></div>' +
            '</div>' +
          '</div>' +
        '</div>';

    itemElem.innerHTML = itemTemplate;
    return itemElem.firstChild;

  }

  function getRandomInt(min,max) {

    return Math.floor(Math.random() * (max - min + 1) + min);

  }

  function getRandomItem(collection) {

    return collection[Math.floor(Math.random() * collection.length)];

  }

  var gridElement = document.querySelector('.grid');
  gridElement.addEventListener('click', function (e) {

    if (elementMatches(e.target, '.card-remove, .card-remove i')) {
      
      removeItem(e);
    }
  });

  function removeItem(e) {
    var elem = elementClosest(e.target, '.item');
    grid.hide(elem, {onFinish: function (items) {
      var item = items[0];
      grid.remove(item, {removeElements: true});
    }});
  }

  function elementMatches(element, selector) {
    alert('777');
    var p = Element.prototype;
    return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);

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
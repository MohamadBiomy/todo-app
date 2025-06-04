


function sdf() {
let list = document.querySelector(".list")
let items = document.querySelectorAll(".lost")

let itemHeight = items[0].offsetHeight

list.style.height = `${items.length * itemHeight + (items.length - 1) }px`

let itemsOrder = []

items.forEach((ele, index) => {
  itemsOrder[index] = index + 1
  ele.style.top = `${(itemHeight) * (itemsOrder[index] - 1)}px`
  ele.style.zIndex = itemsOrder[index]
  makeDraggable(ele, list, index)
})


/* ---------- FUNCTIONS ---------- */ 



function draggble(element, parent) {
  let isDragged = false
  let offsetX = 0; // difference between cursor position and ele position
  let offsetY = 0; // difference between cursor position and ele position

  element.addEventListener("mousedown", (e) => {
    isDragged = true
    offsetX = e.clientX - element.offsetLeft
    offsetY = e.clientY - element.offsetTop
  })

  element.addEventListener("mousemove", (e) => {
    if (isDragged) {
      element.style.cursor = "grabbing"
      element.style.left = `${e.clientX - offsetX}px`
      element.style.top = `${e.clientY - offsetY}px`
    }
  })

  element.addEventListener("mouseup", () => {
    if (isDragged) {
      element.style.cursor = "grab"
      isDragged = false
    }
  })
}


function makeDraggable(element, parent, index) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Ensure both element and parent are positioned
  parent.style.position = 'relative';
  element.style.position = 'absolute';
  element.style.cursor = 'grab';

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const parentRect = parent.getBoundingClientRect();
    // parentRect.left is 0 because the parent element has position: relative
    // but no left offset specified, so it starts at its default position
    let newLeft = e.clientX - parentRect.left - offsetX;
    let newTop = e.clientY - parentRect.top - offsetY;

    // Limit inside the parent
    newLeft = Math.max(0, Math.min(newLeft, parent.clientWidth - element.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, parent.clientHeight - element.offsetHeight));

    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
    element.style.zIndex = 100;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.cursor = 'grab';

    if (element.offsetTop < (itemHeight * ((itemsOrder[index]) - 2)) + itemHeight / 2) {
      console.log("move")
      let newOrder = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].offsetTop + (itemHeight / 2) > element.offsetTop) {
          newOrder = itemsOrder[i]
          itemsOrder[i] = itemsOrder[index]

          break;
        }
      }
      itemsOrder[index] = newOrder
      orderList(itemsOrder)
    } else if (element.offsetTop + itemHeight > (itemHeight * (itemsOrder[index])) + itemHeight / 2) {
      console.log("offset bottom " + (element.offsetTop + itemHeight))
    }
  });
}


function orderList(itemsOrder) {
  console.log(itemsOrder)
  items.forEach((ele, index) => {
    // itemsOrder[index] = index + 1
    ele.style.top = `${(itemHeight) * (itemsOrder[index] - 1)}px`
    ele.style.zIndex = itemsOrder[index]
  })
}
}

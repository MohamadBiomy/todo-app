// DOM elements
const themeToggle = document.querySelector(".theme-toggle") 
const addTaskInput = document.querySelector(".add-task input")
const addButton = document.querySelector(".add")
const tasksContainer = document.querySelector(".tasks-container")
const noTasksMessage = document.querySelector(".no-tasks")
const control = document.querySelector(".control")
const filterTasks = document.querySelectorAll(".switch-state span")
const clearAll = document.querySelector(".clear")
const tasksQuantity = document.querySelector("#tasks-quan")

// Variables
let isDark = true
let tasks = []
let taskType = "all"



// local storage start
// switch theme
if (localStorage.getItem("theme")) {
  if (localStorage.getItem("theme") === "light") {
    isDark = true
    switchTheme()
  } else {
    isDark = false
    switchTheme()
  }
}
// tasks
if (localStorage.getItem("taskType") && JSON.parse(localStorage.getItem("tasks")).length !== 0) {
  taskType = localStorage.getItem("taskType")
  let passedTasks = JSON.parse(localStorage.getItem("tasks"))
  // appending Tasks
  for (let i = 0; i < passedTasks.length; i++) {
    appendTask(passedTasks[i].taskName, passedTasks[i].completed)
  }
  // filter buttons
  filterTasks.forEach(e => {
    if (e.dataset.type === localStorage.getItem("taskType")) {
      filterTasks.forEach(el => el.classList.remove("active"))
      e.classList.add("active")
    }
  })
}
// local storage end



// switch theme
themeToggle.addEventListener("click", switchTheme)


// add task input
addTaskInput.addEventListener("input", () => {
  if (addTaskInput.value) {
    addButton.style.visibility = "visible";
    addButton.style.pointerEvents = "initial"
  } else {
    addButton.style.pointerEvents = "none"
    addButton.style.visibility = "hidden"
  }
})
addTaskInput.addEventListener("keypress", (e) => {
  if (e.key.toLowerCase() === "enter" && addTaskInput.value !== "") {
    addButton.click()
  }
})


// add button
addButton.addEventListener("click", (e) => {
  let taskName = addTaskInput.value
  addTaskInput.value = ""
  addButton.style.pointerEvents = "none"
  addButton.style.visibility = "hidden"

  appendTask(taskName)
})


// clear all completed
clearAll.addEventListener("click", () => {
  tasks.forEach(ele => {
    if (ele.classList.contains("completed")) {
      ele.querySelector("img").click()
    }
  })
  updateTaskQuantity()
})


// filter task
filterTasks.forEach(ele => {
  ele.addEventListener("click", () => {
    filterTasks.forEach(ele => ele.classList.remove("active"))
    ele.classList.add("active")
    taskType = ele.dataset.type
    filterTasksFun(taskType)
  })
})



/* --------- FUNCTIONS --------- */
function switchTheme() {
  if (isDark) {
    isDark = false
    document.body.classList.add("light-mode")
    themeToggle.children[0].src = "./images/icon-moon.svg"
    localStorage.setItem("theme", "light")
  } else {
    themeToggle.children[0].src = "./images/icon-sun.svg"
    isDark = true
    document.body.classList.remove("light-mode")
    localStorage.setItem("theme", "dark")
  }
}

function createTask(taskName) {
  let div = document.createElement("div")
  let img = document.createElement("img")
  let p = document.createElement("p")
  let span = document.createElement("span")
  div.className = "task"
  p.innerHTML = taskName
  img.src = "./images/icon-cross.svg"
  div.append(span)
  div.append(p)
  div.append(img)

  // give each task a unique data-id
  const uniqueId = Date.now() + Math.random().toString(16).slice(2)
  div.setAttribute("data-id", uniqueId)
  

  return div
}

function appendTask(taskName, completed = false) {
  // removing no tasks message
  noTasksMessage.remove()

  // create task
  const task = createTask(taskName)

  // push task into tasks array
  tasks.push(task)
  updateTaskQuantity()

  // append task to tasks container
  tasksContainer.append(task)

  // clicking task
  task.addEventListener("click", () => {
    task.classList.toggle("completed")
    updateTaskQuantity()
    filterTasksFun(taskType)
  })

  makeDraggable(task)

  // add completed class
  if (completed) {
    task.classList.add("completed")
  }

  // click remove
  task.querySelector("img").addEventListener("click", (e) => {
    e.stopPropagation()

    const uniqueId = task.dataset.id
    
    // removing task
    tasks = tasks.filter(ele => {
      return ele.dataset.id !== uniqueId
    })
    task.remove()

    // appending message
    if (tasks.length === 0) {
      tasksContainer.append(noTasksMessage)
    }

    updateTaskQuantity()
    filterTasksFun(taskType)
  })

  // filter
  filterTasksFun(taskType)
}

function updateTaskQuantity() {
  let quan = 0;
  tasks.forEach(ele => {
    if (!ele.classList.contains("completed")) {
      quan++
    }
  })
  tasksQuantity.textContent = quan
}

function filterTasksFun(type) {
  tasksContainer.innerHTML = ""
  let newTask = []

  if (type === "all") {
    newTask = tasks
  } else if (type === "completed") {
    newTask = tasks.filter(ele => {
      return ele.classList.contains("completed")
    })
  } else {
    newTask = tasks.filter(ele => {
      return !ele.classList.contains("completed")
    })
  }


  noTasksMessage.remove()
  
  // if there is no tasks
  if (newTask.length === 0) {
    tasksContainer.append(noTasksMessage)
    if (type === "completed") {
      noTasksMessage.remove()
      let message = document.createElement("div")
      message.className = "no-tasks"
      message.textContent = "Complete tasks to appear here"
      tasksContainer.append(message)
    }
  }

  // appending tasks
  for (let i = 0; i < newTask.length; i++) {
    tasksContainer.append(newTask[i])
  }

  updateTaskQuantity()

  // local storage
  let localStorageTasks = tasks.map(e => {
    if (e.classList.contains("completed")) {
      return {taskName: e.querySelector("p").textContent, completed: true}
    } else {
      return {taskName: e.querySelector("p").textContent, completed: false}
    }
  })
  localStorage.setItem("taskType", taskType)
  localStorage.setItem("tasks", JSON.stringify(localStorageTasks))
}

function makeDraggable(element) {
  element.setAttribute('draggable', 'true');
  
  element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', element.dataset.id);
    element.classList.add('dragging');
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('dragging');
  });
}

// Add drag and drop event listeners to tasks container
tasksContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const draggingElement = document.querySelector('.dragging');
  const siblings = [...tasksContainer.querySelectorAll('.task:not(.dragging)')];
  
  const nextSibling = siblings.find(sibling => {
    const box = sibling.getBoundingClientRect();
    const offset = e.clientY - box.top - box.height / 2;
    return offset < 0;
  });

  if (nextSibling) {
    tasksContainer.insertBefore(draggingElement, nextSibling);
  } else {
    tasksContainer.appendChild(draggingElement);
  }
});

tasksContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData('text/plain');
  const draggedElement = document.querySelector(`[data-id="${draggedId}"]`);
  
  // Update tasks array order
  const newTasks = [...tasks];
  const draggedIndex = newTasks.findIndex(task => task.dataset.id === draggedId);
  const droppedIndex = Array.from(tasksContainer.children).indexOf(draggedElement);
  
  newTasks.splice(draggedIndex, 1);
  newTasks.splice(droppedIndex, 0, draggedElement);
  tasks = newTasks;
  
  // Update local storage
  let localStorageTasks = tasks.map(e => {
    if (e.classList.contains("completed")) {
      return {taskName: e.querySelector("p").textContent, completed: true}
    } else {
      return {taskName: e.querySelector("p").textContent, completed: false}
    }
  });
  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
});
// ===============================
// STATE
// ===============================
let tasks = JSON.parse(localStorage.getItem("my-todos")) || [];
let currentFilter = "all";

// ===============================
// DOM ELEMENTS
// ===============================
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalEl = document.querySelector(".stats span:nth-child(1)");
const activeEl = document.querySelector(".stats span:nth-child(2)");
const completedEl = document.querySelector(".stats span:nth-child(3)");

// ===============================
// HELPER FUNCTIONS
// ===============================
function saveTasks() {
  localStorage.setItem("my-todos", JSON.stringify(tasks));
}

function getFilteredTasks() {
  switch (currentFilter) {
    case "active":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}

// ===============================
// RENDER TASKS
// ===============================
function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = getFilteredTasks();

  visibleTasks.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });

  updateCounters();
}

// ===============================
// CREATE TASK ELEMENT
// ===============================
function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = "task";

  if (task.completed) {
    div.classList.add("completed");
  }

  div.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""}>
    <span>${task.text}</span>
    <button class="delete-btn">×</button>
  `;

  const checkbox = div.querySelector("input");
  const deleteBtn = div.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => toggleTask(task.id));
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  return div;
}

// ===============================
// TASK ACTIONS
// ===============================
function addTask() {
  const text = taskInput.value.trim();

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";

  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
}

// ===============================
// UPDATE COUNTERS
// ===============================
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;

  totalEl.textContent = `TOTAL: ${total}`;
  activeEl.textContent = `ACTIVE: ${active}`;
  completedEl.textContent = `COMPLETED: ${completed}`;
}

// ===============================
// EVENT LISTENERS
// ===============================
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

clearBtn.addEventListener("click", clearCompletedTasks);

// ===============================
// INITIAL RENDER
// ===============================
renderTasks();

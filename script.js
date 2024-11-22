const form = document.querySelector("form");
const input = document.querySelector("input");
const button = document.querySelector("button[type='submit']");
const ul = document.querySelector(".container");

let items = JSON.parse(localStorage.getItem("items")) ?? [];
let state = "add"; // 'edit'
let editItemId = null;
const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

function formatDate(time) {
  const date = new Date(time);

  const year = date.getFullYear();

  const monthIndex = date.getMonth();
  const month = months[monthIndex];
  const dateNumber = date.getDate();

  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return `${dateNumber}-${month}, ${year}, ${hours}:${minutes}`;
}

// IIFE
(function () {
  console.log(items);
  button.disabled = true;
  renderItems();
})();

input.oninput = function () {
  if (input.value) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
};

form.onsubmit = function (event) {
  event.preventDefault();

  if (input.value) {
    if (state === "add") {
      const item = {
        id: Date.now(),
        name: input.value,
        completed: false,
      };
      items.push(item);
    } else if (state === "edit") {
      updateItem(editItemId, input.value);
    }

    renderItems();
    saveItems();
    editItemId = null;
    state = "add";
    button.textContent = state;
  }

  input.value = "";
};

function renderItems() {
  ul.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.textContent = item.name;

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.append(checkbox);
    checkbox.onchange = () => {
      check(item.id);
    };
    if (item.completed) {
      li.classList.add("completed");
      checkbox.checked = true;
    }

    const date = formatDate(item.id);
    const span = document.createElement("span");
    span.textContent = date;
    span.style.color = "gray";
    li.append(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      console.log("delete");
      deleteItem(item.id);
    });
    li.append(deleteBtn);

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.addEventListener("click", function () {
      editItemId = item.id;
      state = "edit";
      input.value = item.name;
      button.disabled = false;
      button.textContent = "Edit";
      // updateItem(id, text);
    });

    li.append(updateBtn);

    ul.append(li);
  });
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  renderItems();
  saveItems();
}

function updateItem(id, name) {
  items = items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        name,
      };
    } else {
      return item;
    }
  });
  saveItems();
  renderItems();
}

// checkbox checked
function check(id) {
  const todo = items.find((i) => i.id === id);
  if (todo) {
    // console.log(todo)
    todo.completed = !todo.completed;
    // console.log(todo)
  }
  // item = todo
  saveItems();
  renderItems();
}

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

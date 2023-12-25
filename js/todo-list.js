"use strict";

(() => {
  let firstRun = true;
  if (firstRun) {
    updatePriority();
    firstRun = false;
  }
})();

// Set global variables
let todoCounter = 0;
const todoHolder = document.querySelector("#todo-holder");

/*
  Swapping css files: https://stackoverflow.com/questions/37594860/how-to-change-css-file-using-javascript
*/
const toggleTheme = (themeBtn) => {
  let allLinks = document.querySelectorAll("link");
  const todoTable = document.querySelector("#todo-table");
  const todoTableBody = document.querySelector("#todo-holder");
  for (let index = 0; index < allLinks.length; index++) {
    const element = allLinks[index];
    if (element.href.includes("todo-list-light")) {
      element.href = "../styles/todo-list-dark.css";
      todoTable.classList.add("table-dark");
      document.querySelector("#form-container").classList.remove("border-dark");
      themeBtn.innerText = "Light Theme";
    } else if (element.href.includes("todo-list-dark")) {
      element.href = "../styles/todo-list-light.css";
      todoTable.classList.remove("table-dark");
      document.querySelector("#form-container").classList.add("border-dark");
      themeBtn.innerText = "Dark Theme";
    }
  }
};
/*
  End swapping css files: https://stackoverflow.com/questions/37594860/how-to-change-css-file-using-javascript
*/

const updateTitle = (elm) => {
  const usersTitle = prompt("Enter a new title:");
  if (usersTitle !== null && usersTitle !== "") {
    elm.innerText = usersTitle;
  }
};

function createToDo(title, type, priority, date) {
  // Create the To-Do item row
  const todoRowHolder = document.createElement("tr");
  todoRowHolder.classList.add("todo-row");
  todoCounter += 1;
  todoRowHolder.id = `todo-row-${todoCounter}`;

  // Create the td elements
  const titleElm = document.createElement("td");
  const ddlType = document.createElement("td");
  const dateElm = document.createElement("td");
  const priorityElm = document.createElement("td");
  const actionElm = document.createElement("td");

  // Add the required class(es) & id(s)
  titleElm.classList.add("todo-title");
  titleElm.id = `todo-title-${todoCounter}`;
  ddlType.classList.add("todo-type");
  ddlType.id = `todo-type-${todoCounter}`;
  dateElm.classList.add("todo-date");
  dateElm.id = `todo-date-${todoCounter}`;
  priorityElm.classList.add("todo-priority");
  priorityElm.id = `todo-priority-${todoCounter}`;
  actionElm.classList.add("todo-action");
  actionElm.id = `todo-action-${todoCounter}`;

  // Create the text nodes and add the form values
  const titleText = document.createTextNode(title);
  const typeText = document.createTextNode(type);
  const dateText = document.createTextNode(date);

  const intPriority = parseInt(priority);
  let stars = "";
  for (let index = 0; index < intPriority; index++) {
    stars += "⭐";
  }
  const priorityText = document.createTextNode(stars);
  const actionText = document.createTextNode("✔️");

  // Add the text nodes to the tds
  titleElm.appendChild(titleText);
  ddlType.appendChild(typeText);
  dateElm.appendChild(dateText);
  priorityElm.appendChild(priorityText);
  actionElm.appendChild(actionText);

  // Add the tds to the row
  todoRowHolder.appendChild(titleElm);
  todoRowHolder.appendChild(ddlType);
  todoRowHolder.appendChild(dateElm);
  todoRowHolder.appendChild(priorityElm);
  todoRowHolder.appendChild(actionElm);

  // Add the onclick event for removal
  actionElm.onclick = function () {
    const todoRow = this.parentElement;
    todoRow.remove();
  };

  // Add mouse events to change ✔️ to ❌
  actionElm.onmouseenter = function () {
    this.innerText = "❌";
  };

  actionElm.onmouseleave = function () {
    this.innerText = "✔️";
  };

  // Add the row to the holder
  todoHolder.appendChild(todoRowHolder);

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const form = document.getElementById("add-todo-form");
  if (form.classList.contains("was-validated")) {
    form.classList.remove("was-validated");
  }
}

function isValidDate(dateElm) {
  // Check if date is prior to now and throw error if true
  const dateAsDate = new Date(dateElm.value);
  const day = String(new Date().getDate()).padStart(2, "0");
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const year = String(new Date().getFullYear());
  const today = `${year}-${month}-${day}`;
  const todayAsDate = new Date(today);
  if (
    dateAsDate instanceof Date &&
    !isNaN(dateAsDate.valueOf()) &&
    dateAsDate < todayAsDate
  ) {
    if (dateElm.classList.contains("is-valid")) {
      dateElm.classList.remove("is-valid");
    }
    dateElm.classList.add("is-invalid");
    const invalidDateElm = document.getElementById("invalid-date-elm");
    invalidDateElm.textContent = "Date cannot be in the past.";
    return false;
  } else {
    const title = document.querySelector("#title");
    const type = document.querySelector("#ddl-type");
    const date = document.querySelector("#date");
    if (dateElm.classList.contains("is-invalid")) {
      dateElm.classList.remove("is-invalid");
      dateElm.classList.add("is-valid");
    }
    if (title.classList.contains("is-valid")) {
      title.classList.remove("is-valid");
    }
    if (type.classList.contains("is-valid")) {
      type.classList.remove("is-valid");
    }
    if (date.classList.contains("is-valid")) {
      date.classList.remove("is-valid");
    }
    return true;
  }
}

function addToDoItem() {
  let hasError = false;
  // Get the form element values
  const form = document.getElementById("add-todo-form");
  const title = document.querySelector("#title");
  const type = document.querySelector("#ddl-type");
  const priority = document.querySelector("#priority");
  const date = document.querySelector("#date");

  /*
   *    If the values are empty, then notify the user they are required.
   *    Otherwise, mark them as valid.
   */
  if (title.value === "") {
    hasError = true;
    title.classList.add("is-invalid");
  } else {
    hasError = false;
    if (title.classList.contains("is-invalid")) {
      title.classList.remove("is-invalid");
      title.classList.add("is-valid");
    }
  }

  if (type.value === "") {
    hasError = true;
    type.classList.add("is-invalid");
  } else {
    hasError = false;
    if (type.classList.contains("is-invalid")) {
      type.classList.remove("is-invalid");
      type.classList.add("is-valid");
    }
  }

  if (date.value === "") {
    hasError = true;
    date.classList.add("is-invalid");
  } else {
    hasError = false;
    if (date.classList.contains("is-invalid")) {
      date.classList.remove("is-invalid");
      date.classList.add("is-vallid");
    }
  }
  /*
   *    The date should not be in the past, if it is notify the user.
   *    If the date is valid then create the To-Do item.
   */
  if (!hasError) {
    if (isValidDate(date)) {
      form.classList.add("was-validated");
      createToDo(title.value, type.value, priority.value, date.value);
  
      // Set values back to default
      title.value = "";
      type.value = "";
      priority.value = "1";
      updatePriority();
      date.value = "";
    }
  }
}

function updatePriority() {
  const priority = document.querySelector("#priority").value;
  const priorityLabel = document.querySelector("#priority-label");
  priorityLabel.textContent = `Priority:  ${priority}`;
}

function resetForm() {
  const form = document.getElementById("add-todo-form");
  const title = document.querySelector("#title");
  const type = document.querySelector("#ddl-type");
  const date = document.querySelector("#date");

  if (title.classList.contains("is-valid"))
    title.classList.remove("is-valid");
  if (title.classList.contains("is-invalid"))
    title.classList.remove("is-invalid");
  if (type.classList.contains("is-valid"))
    type.classList.remove("is-valid");
  if (type.classList.contains("is-invalid"))
    type.classList.remove("is-invalid");
  if (date.classList.contains("is-valid"))
    date.classList.remove("is-valid");
  if (date.classList.contains("is-invalid"))
    date.classList.remove("is-invalid");
  if (form.classList.contains("was-validated"))
    form.classList.remove("was-validated");
}
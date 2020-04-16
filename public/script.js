function hideNotes() {
  let table = document.getElementById("taskTable");
  for (let i = 1; i < table.rows.length; i++) {
    let taskID = i;
    let hit = document.getElementById("icon" + taskID);
    if (hit.getAttribute("hit") === "1") {
      document.querySelectorAll("#myDiv" + taskID).forEach(function (a) {
        a.remove();
      });
      hit.setAttribute("hit", 0);
      hit.innerHTML = "+";
    }
  }
}

function sortTable(n) {
  hideNotes();
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("taskTable");
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortPriority(n) {
  hideNotes();
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("taskTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() === "high") {
          if (y.innerHTML.toLowerCase() !== "high") {
            shouldSwitch = true;
            break;
          }
        } else if (x.innerHTML.toLowerCase() === "medium") {
          if (y.innerHTML.toLowerCase() === "low") {
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() === "low") {
          if (y.innerHTML.toLowerCase() !== "low") {
            shouldSwitch = true;
            break;
          }
        } else if (x.innerHTML.toLowerCase() === "medium") {
          if (y.innerHTML.toLowerCase() === "high") {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function tomorrowDate() {
  const today = new Date();
  const tommorow = new Date(today);
  tommorow.setDate(tommorow.getDate() + 1);
  return formatDate(tommorow);
}

function editTask(no) {
  let btn = document.getElementById("edit" + no);
  if (btn.innerHTML === "Edit") {
    let date = document.getElementById("date" + no);
    let priority = document.getElementById("priority" + no);
    let state = document.getElementById("state" + no);

    let date_data = date.innerHTML;
    let priority_data = priority.innerHTML;
    let state_data = state.innerHTML;

    date.innerHTML =
      "<input type='date' id='date_text" + no + "' value='" + date_data + "'>";
    priority.innerHTML =
      "<select id='priority_text" +
      no +
      "'><option value='high'>High</option><option value='medium'>Medium</option><option value='low'>Low</option></select>";
    state.innerHTML =
      "Completed: <input type='checkbox' id='state_text" + no + "'>";
    btn.innerHTML = "Save";
  } else {
    let date_val = document.getElementById("date_text" + no).value;
    if (date_val === "") {
      date_val = tomorrowDate();
    }

    let priority_val = document.getElementById("priority_text" + no).value;
    let state_chk = document.getElementById("state_text" + no).checked;
    let state_val = "incomplete";
    if (state_chk === true) {
      state_val = "complete";
    }

    let date = document.getElementById("date" + no);
    let priority = document.getElementById("priority" + no);
    let state = document.getElementById("state" + no);

    date.innerHTML = date_val;
    priority.innerHTML = priority_val;
    state.innerHTML = state_val;

    addTaskToJson(date_val, priority_val, state_val, no);
    btn.innerHTML = "Edit";
  }
}

async function addTaskToJson(date, priority, state, id) {
  const resp = await fetch("/todos/" + id, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ date, priority, state }),
  });
}
async function displayNotes(taskID) {
  let hit = document.getElementById("icon" + taskID);
  if (hit.getAttribute("hit") === "0") {
    const resp = await fetch("/todos/" + taskID + "/notes", { method: "GET" });
    notes = await resp.json();

    let myTable = document.getElementById("taskTable");
    let myDiv = document.createElement("div");
    myDiv.id = "myDiv" + taskID;
    // myDiv.id = "myDiv";

    if (notes.length > 0) {
      let ul = document.createElement("ul");
      ul.id = "ul" + taskID;
      for (let element of notes) {
        for (key in element) {
          let li = document.createElement("li");
          li.textContent = element[key];
          ul.appendChild(li);
        }
      }
      myDiv.appendChild(ul);
      let x = document.createElement("INPUT");
      x.setAttribute("type", "text");
      x.placeholder = "Enter Note";
      x.id = "inputNotes" + taskID;
      myDiv.appendChild(x);

      let btn = document.createElement("button");
      btn.id = "addNotes" + taskID;
      btn.innerHTML = "ADD";
      btn.setAttribute("onclick", "addNotes(" + taskID + ");");
      myDiv.appendChild(btn);

      let referenceNode = document.querySelector("#row" + taskID);
      referenceNode.after(myDiv);
    } else {
      let x = document.createElement("INPUT");
      x.setAttribute("type", "text");
      x.id = "inputNotes" + taskID;
      x.placeholder = "Enter Note";
      myDiv.appendChild(x);

      let btn = document.createElement("button");
      btn.id = "addNotes" + taskID;
      btn.setAttribute("onclick", "addNotes(" + taskID + ");");
      btn.innerHTML = "ADD";
      myDiv.appendChild(btn);

      let referenceNode = document.querySelector("#row" + taskID);
      referenceNode.after(myDiv);
    }
    hit.setAttribute("hit", 1);
    hit.innerHTML = "-";
  } else {
    document.querySelectorAll("#myDiv" + taskID).forEach(function (a) {
      a.remove();
    });
    hit.setAttribute("hit", 0);
    hit.innerHTML = "v";
  }
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// returns tomorrow date
function tomorrowDate() {
  const today = new Date();
  const tommorow = new Date(today);
  tommorow.setDate(tommorow.getDate() + 1);
  return formatDate(tommorow);
}

window.onload = function () {
  document.getElementById("myDate").value = tomorrowDate();
};

// add task
function addTask() {
  let title = document.getElementById("title").value;
  if (title === "") {
    alert("Enter Title");
    return;
  }
  let description = document.getElementById("description").value;
  let date = document.getElementById("myDate").value;
  if (date === "") {
    date = tomorrowDate();
  }
  let priority = document.getElementById("priority").value;
  let state = "incomplete";
  addNewTaskToJson(title, description, date, priority, state);
  getLastTask();
}

async function getLastTask() {
  let table = document.querySelector("table");
  let lastRow = table.rows.length;
  const resp = await fetch("/todos/" + lastRow, { method: "GET" });
  const tasks = await resp.json();
  let row = table.insertRow();
  row.id = "row" + lastRow;
  let cell = row.insertCell();
  let text = document.createTextNode("+");
  cell.className = "child";
  cell.id = "icon" + lastRow;
  cell.setAttribute("hit", 0);
  cell.setAttribute("onclick", "displayNotes(" + lastRow + ");");
  cell.appendChild(text);

  for (key in tasks) {
    let cell = row.insertCell();
    cell.id = key + lastRow;
    let text = document.createTextNode(tasks[key]);
    cell.appendChild(text);
  }

  let lcell = row.insertCell();
  let ltext = document.createTextNode("Edit");
  lcell.className = "child";
  lcell.id = "edit" + lastRow;
  lcell.setAttribute("onclick", "editTask(" + lastRow + ");");
  lcell.appendChild(ltext);
}

async function addNewTaskToUrlEncode(
  title,
  description,
  date,
  priority,
  state
) {
  const resp = await fetch("/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `title=${title}&description=${description}&date=${date}&priority=${priority}&state=${state}`,
  });
}

async function addNewTaskToJson(title, description, date, priority, state) {
  const resp = await fetch("/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ title, description, date, priority, state }),
  });
}
function addNotes(taskID) {
  let newNote = document.getElementById("inputNotes" + taskID).value;
  if (newNote === "") {
    alert("Please Enter Note");
    return;
  }
  let ul = document.getElementById("ul" + taskID);
  if (typeof ul != "undefined" && ul != null) {
    let li = document.createElement("li");
    li.textContent = newNote;
    ul.appendChild(li);
  } else {
    let myDiv = document.getElementById("myDiv" + taskID);
    ul = document.createElement("ul");
    ul.id = "ul" + taskID;
    let li = document.createElement("li");
    li.textContent = newNote;
    ul.appendChild(li);
    let firstChild = document.getElementById("inputNotes" + taskID);
    myDiv.insertBefore(ul, myDiv.firstChild);
  }
  addNewNoteToJson(newNote, taskID);
}

async function addNewNoteToJson(note, taskId) {
  const resp = await fetch("/todos/" + taskId + "/notes", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ note }),
  });
}

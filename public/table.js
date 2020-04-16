async function f() {
  const resp = await fetch("/todos", { method: "GET" });
  tasks = await resp.json();
  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    const sortColumns = ["date", "priority", "state"];
    let th = document.createElement("th");
    let text = document.createTextNode("");
    th.id = "icon0";
    row.appendChild(th);
    for (let [index, key] of data.entries()) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      th.id = key + 0;
      if (sortColumns.indexOf(key) !== -1) {
        if (key === "priority") {
          th.setAttribute("onclick", "sortPriority(" + (index + 1) + ")");
        } else {
          th.setAttribute("onclick", "sortTable(" + (index + 1) + ")");
        }
      }
      row.appendChild(th);
    }

    let ths = document.createElement("th");
    ths.id = "edit0";
    let texts = document.createTextNode("Edit");
    ths.appendChild(texts);
    row.appendChild(ths);
    th.appendChild(text);
  }

  function generateTable(table, data) {
    for (let [index, element] of data.entries()) {
      let row = table.insertRow();
      row.id = "row" + data[index].id;
      let cell = row.insertCell();
      let text = document.createTextNode("v");
      cell.className = "child";
      cell.id = "icon" + data[index].id;
      cell.setAttribute("hit", 0);
      cell.setAttribute("onclick", "displayNotes(" + data[index].id + ");");
      cell.appendChild(text);

      for (key in element) {
        let cell = row.insertCell();
        cell.id = key + data[index].id;
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }

      let lcell = row.insertCell();
      let ltext = document.createTextNode("Edit");
      lcell.className = "child";
      lcell.id = "edit" + data[index].id;
      lcell.setAttribute("onclick", "editTask(" + data[index].id + ");");
      lcell.appendChild(ltext);
    }
  }

  let table = document.querySelector("table");
  let data = Object.keys(tasks[0]);
  generateTableHead(table, data);
  generateTable(table, tasks);
}
f();

class TaskManager {
  constructor() {
    // Parse tasks from local storage, if it exists, or use an empty array
    this.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    this.showTasks();

    const elem = document.querySelector("header");

    if (elem) {
      const button = elem.querySelector("button");
      if (button) {
        button.addEventListener("click", (ev) => {
          const elemTitle = elem.querySelector("#title");
          const elemDescription = elem.querySelector("#description");
          const elemPriority = elem.querySelector("#priority");
          const elemDueDate = elem.querySelector("#dueDate");
          const elemStatus = elem.querySelector("#status");

          const title = elemTitle ? elemTitle.value : "";
          const description = elemDescription ? elemDescription.value : "";
          const priority = elemPriority ? elemPriority.value : "";
          const dueDate = elemDueDate ? elemDueDate.value : "";
          const status = elemStatus ? elemStatus.value : "";

          if (elemTitle) elemTitle.value = "";
          if (elemDescription) elemDescription.value = "";
          if (elemPriority) elemPriority.value = "0";
          if (elemDueDate) elemDueDate.value = "";
          if (elemStatus) elemStatus.value = "";

          this.addTask(title, description, dueDate, status, priority);
        });
      }
    }
  }

  addTask(title, description, dueDate, status, priority) {
    const ids = this.tasks.map((x) => x.id);
    const max = Math.max(...ids);

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const mn = now.getMinutes();
    const s = now.getSeconds();

    const addedTime = `${y}-${m < 10 ? "0" + m : m}-${d} ${h}:${mn}:${s}`;

    // Push a new task into the array
    this.tasks.push({
      id: max + 1,
      title,
      description,
      addedTime,
      dueDate,
      status,
      isCompleted: false,
      priority: priority || "0",
    });

    // Render tasks
    this.showTasks();
  }

  removeTask(taskId) {
    const i = this.tasks.findIndex((x) => x.id === taskId);
    this.tasks.splice(i, 1);
    this.showTasks();
  }

  completeTask(taskId) {
    const item = this.tasks.find((x) => x.id === taskId);
    if (item) {
      item.isCompleted = true;
    }
    this.showTasks();
  }

  unCompleteTask(taskId) {
    const item = this.tasks.find((x) => x.id === taskId);
    if (item) {
      item.isCompleted = false;
    }
    this.showTasks();
  }

  showTasks() {
    const elem = document.querySelector("div.tasks");
    if (elem) {
      elem.innerHTML = "";

      this.tasks.forEach((t) => {
        const div = document.createElement("div");

        if (t.isCompleted) {
          div.classList.add("completed");
        }

        // Assign class based on priority
        switch (t.priority) {
          case "0":
            div.classList.add("low");
            break;
          case "1":
            div.classList.add("medium");
            break;
          case "2":
            div.classList.add("high");
            break;
        }

        div.innerHTML = `
                    <h3><span class="priority-indicator"></span>${t.title}</h3>
                    <p><b>Description:</b> ${t.description}</p> 
                    <p><b>Creation Time:</b> ${t.addedTime}</p>
                    <p><b>Due Date:</b> ${t.dueDate || "Not set"}</p>
                    <p><b>Status:</b> ${t.status || "Not set"}</p>

                    <footer>
                        <button class="remove">Delete</button>
                        ${
                          t.isCompleted
                            ? '<button class="uncomplete">Not done</button>'
                            : '<button class="complete">Done</button>'
                        }
                    </footer>
                `;

        const removeButton = div.querySelector(".remove");
        const completeButton = div.querySelector(".complete");
        const unCompleteButton = div.querySelector(".uncomplete");

        if (removeButton) {
          removeButton.addEventListener("click", () => this.removeTask(t.id));
        }

        if (completeButton) {
          completeButton.addEventListener("click", () =>
            this.completeTask(t.id)
          );
        }

        if (unCompleteButton) {
          unCompleteButton.addEventListener("click", () =>
            this.unCompleteTask(t.id)
          );
        }

        // Append the task div to the tasks div
        elem.appendChild(div);
      });

      // Store tasks in local storage
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
  }
}

const tasks = new TaskManager();

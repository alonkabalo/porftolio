class TaskManager {
    tasks: { id: number, title: string, description: string, addedTime: string, dueDate: string, status: string, isCompleted: boolean, priority: string }[];

    constructor() {
        // Initializing tasks from localStorage or an empty array if localStorage is empty.
        this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        this.showTasks();

        const elem = document.querySelector("header");

        if (elem) {
            const button = elem.querySelector("button");
            if (button) {
                button.addEventListener("click", ev => {
                    const elemTitle: HTMLInputElement | null = elem.querySelector("#title");
                    const elemDescription: HTMLTextAreaElement | null = elem.querySelector("#description"); 
                    const elemPriority: HTMLSelectElement | null = elem.querySelector("#priority");
                    const elemDueDate: HTMLInputElement | null = elem.querySelector("#dueDate");
                    const elemStatus: HTMLSelectElement | null = elem.querySelector("#status");

                    const title: string = elemTitle ? elemTitle.value : '';
                    const description: string = elemDescription ? elemDescription.value : ''; 
                    const priority: string = elemPriority ? elemPriority.value : '';
                    const dueDate: string = elemDueDate ? elemDueDate.value : '';
                    const status: string = elemStatus ? elemStatus.value : '';

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

    addTask(title: string, description: string, dueDate: string, status: string, priority: string) {

        // Getting the maximum id from the tasks array
        const ids = this.tasks.map(x => x.id);
        const max = Math.max(...ids);

        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        const h = now.getHours();
        const mn = now.getMinutes();
        const s = now.getSeconds();

        const addedTime = `${y}-${(m < 10 ? '0' + m : m)}-${d} ${h}:${mn}:${s}`;

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

        this.showTasks();
    }

    removeTask(taskId: number) {
        const i = this.tasks.findIndex(x => x.id === taskId);
        this.tasks.splice(i, 1);
        this.showTasks();
    }

    // Function to mark a task as completed
    completeTask(taskId: number) {
        const item = this.tasks.find(x => x.id === taskId);
        if (item) {
            item.isCompleted = true;
        }
        this.showTasks();
    }

    unCompleteTask(taskId: number) {
        const item = this.tasks.find(x => x.id === taskId);
        if (item) {
            item.isCompleted = false;
        }
        this.showTasks();
    }

    // Function to render all tasks to the HTML
    showTasks() {
        const elem = document.querySelector("div.tasks");
        if (elem) {
            elem.innerHTML = "";

            // Looping over each task to create its HTML representation
            this.tasks.forEach(t => {
                const div = document.createElement("div");

                if (t.isCompleted) {
                    div.classList.add('completed');
                }

                switch (t.priority) {
                    case "0" : div.classList.add('low'); break;
                    case "1" : div.classList.add('medium'); break;
                    case "2" : div.classList.add('high'); break;
                }

                // Creating the task HTML
                div.innerHTML = `
                    <h3><span class="priority-indicator"></span>${t.title}</h3>
                    <p><b>Description:</b> ${t.description}</p> 
                    <p><b>Creation Time:</b> ${t.addedTime}</p>
                    <p><b>Due Date:</b> ${t.dueDate || 'Not set'}</p>
                    <p><b>Status:</b> ${t.status || 'Not set'}</p>

                    <footer>
                        <button class="remove">Delete</button>
                        ${t.isCompleted ? '<button class="uncomplete">Not done</button>' : '<button class="complete">Done</button>'}
                    </footer>
                `;

                const removeButton = div.querySelector('.remove');
                const completeButton = div.querySelector('.complete');
                const unCompleteButton = div.querySelector('.uncomplete');

                if (removeButton) {
                    removeButton.addEventListener("click", () => this.removeTask(t.id));
                }

                if (completeButton) {
                    completeButton.addEventListener("click", () => this.completeTask(t.id));
                }

                if (unCompleteButton) {
                    unCompleteButton.addEventListener("click", () => this.unCompleteTask(t.id));
                }

                elem.appendChild(div);
            });

            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }
}

// Creating an instance of the TaskManager class
const tasks = new TaskManager();

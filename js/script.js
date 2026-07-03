const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const clearCompleted = document.getElementById("clearCompleted");
const deleteAll = document.getElementById("deleteAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}

function renderTasks() {

    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;

    });

    filteredTasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span>${task.text}</span>

            </div>

            <div class="actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const editBtn = li.querySelector(".edit-btn");

        editBtn.addEventListener("click", () => {

            const newTask = prompt("Edit Task", task.text);

            if (newTask !== null && newTask.trim() !== "") {

                task.text = newTask.trim();

                saveTasks();

                renderTasks();

            }

        });

        const deleteBtn = li.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(li);

    });

    updateStats();

}

addTaskBtn.addEventListener("click", () => {

    const value = taskInput.value.trim();

    if (value === "") {

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        text: value,

        completed: false

    });

    taskInput.value = "";

    saveTasks();

    renderTasks();

});

taskInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        addTaskBtn.click();

    }

});

searchInput.addEventListener("input", renderTasks);

filterSelect.addEventListener("change", renderTasks);

clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});

deleteAll.addEventListener("click", () => {

    if(confirm("Delete all tasks?")){

        tasks=[];

        saveTasks();

        renderTasks();

    }

});

renderTasks();

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeToggle.textContent = "☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        themeToggle.textContent = "🌙 Dark Mode";
    }

});
document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const todoList = document.getElementById('todo-list');
    const progressBar = document.getElementById('progress');
    const listSelector = document.getElementById('list-selector');
    const newListBtn = document.getElementById('new-list-btn');
    const newListInput = document.getElementById('new-list-input');
    const totalProgress = document.getElementById('prog');
    const totalListProgress = document.getElementById('prog1');

    let lists = JSON.parse(localStorage.getItem('todo_lists')) || { 'default': [] };
    let currentList = 'default';

    function saveLists() {
        localStorage.setItem('todo_lists', JSON.stringify(lists));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        const tasks = lists[currentList];
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                        <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
                        <label for="task-${index}">${task.text}</label>
                        <button class="delete-btn" aria-label="Delete task">x</button>
                    `;
            todoList.appendChild(li);

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTask(index));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));
        });
        updateProgress();
    }

    function addTask() {
        const text = newTaskInput.value.trim();
        if (text) {
            lists[currentList].push({ text, completed: false });
            newTaskInput.value = '';
            saveLists();
            renderTasks();
        }
    }

    function toggleTask(index) {
        lists[currentList][index].completed = !lists[currentList][index].completed;
        saveLists();
        renderTasks();
    }

    function deleteTask(index) {
        lists[currentList].splice(index, 1);
        saveLists();
        renderTasks();
    }

    function updateProgress() {
        const tasks = lists[currentList];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        let tot = 0;
        let tot_c = 0;
        let noOfLists = 0;
        Object.keys(lists).forEach(listName => {
            tot = tot + lists[listName].length;
            tot_c = tot_c + lists[listName].filter(task => task.completed).length;
            if (lists[listName].length == lists[listName].filter(task => task.completed).length) {
                noOfLists++;
            }
        });
        const progressTot = tot === 0 ? 0 : (tot_c / tot) * 100;
        progressBar.style.width = `${progress}%`;
        totalProgress.innerHTML = `${tot_c} / ${tot}`;
        totalListProgress.innerHTML = `${noOfLists}`;
    }

    function renderListSelector() {
        listSelector.innerHTML = '';
        Object.keys(lists).forEach(listName => {
            const option = document.createElement('option');
            option.value = listName;
            option.textContent = listName;
            listSelector.appendChild(option);
        });
        listSelector.value = currentList;
    }

    listSelector.addEventListener('change', (e) => {
        currentList = e.target.value;
        renderTasks();
    });

    newListBtn.addEventListener('click', () => {
        newListInput.style.display = 'block';
        newListInput.focus();
    });

    newListInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const newListName = newListInput.value.trim();
            if (newListName && !lists[newListName]) {
                lists[newListName] = [];
                currentList = newListName;
                saveLists();
                renderListSelector();
                renderTasks();
                newListInput.value = '';
                newListInput.style.display = 'none';
            }
        }
    });

    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    renderListSelector();
    renderTasks();
});
function lighting() {
    const root = document.querySelector(':root');
    if (document.getElementById('lightmode').checked) {
        root.style.setProperty("--background-color", "#1d1d1f");
        root.style.setProperty("--card-background", "#000000");
        root.style.setProperty("--text-color", "#f7f7f7");
        root.style.setProperty("--accent-color", "#ffffff");
        root.style.setProperty("--progress-color", "#f7f7f7");
        console.log("checked");
    }
    else if (!document.getElementById('lightmode').checked) {
        root.style.setProperty("--background-color", "#f7f7f7");
        root.style.setProperty("--card-background", "#ffffff");
        root.style.setProperty("--text-color", "#1d1d1f");
        root.style.setProperty("--accent-color", "#000000");
        root.style.setProperty("--progress-color", "#000000");
    }

}




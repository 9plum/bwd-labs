class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.initializeEventListeners();
        this.renderTasks();
    }

    loadTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || {
            todo: [],
            inProgress: [],
            completed: []
        };
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(text, deadline) {
        const task = {
            id: Date.now(),
            text,
            deadline,
            createdAt: new Date().toISOString()
        };
        this.tasks.todo.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(taskId, status) {
        this.tasks[status] = this.tasks[status].filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    moveTask(taskId, fromStatus, toStatus) {
        const taskIndex = this.tasks[fromStatus].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const task = this.tasks[fromStatus].splice(taskIndex, 1)[0];
            this.tasks[toStatus].push(task);
            this.saveTasks();
            this.renderTasks();
        }
    }

    getRemainingTime(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;

        if (diff < 0) return 'Просрочено';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return `${days}д ${hours}ч`;
    }

    createTaskElement(task, status) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" ${status === 'completed' ? 'checked' : ''} />
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-deadline">Срок: ${this.getRemainingTime(task.deadline)}</div>
            </div>
            <button class="button delete-btn">Удалить</button>
        `;

        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            let newStatus;
            if (status === 'todo') newStatus = 'inProgress';
            else if (status === 'inProgress') newStatus = 'completed';
            
            if (newStatus) {
                this.moveTask(task.id, status, newStatus);
            }
        });

        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this.deleteTask(task.id, status);
        });

        return taskElement;
    }

    renderTasks() {
        const columns = {
            todo: document.querySelector('#todo-column .tasks-container'),
            inProgress: document.querySelector('#in-progress-column .tasks-container'),
            completed: document.querySelector('#completed-column .tasks-container')
        };

        if (!columns.todo || !columns.inProgress || !columns.completed) return;

        Object.keys(columns).forEach(status => {
            columns[status].innerHTML = '';
            this.tasks[status].forEach(task => {
                columns[status].appendChild(this.createTaskElement(task, status));
            });
        });
    }

    initializeEventListeners() {
        const submitBtn = document.getElementById('submit-task-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const taskInput = document.getElementById('taskInput');
                const deadlineInput = document.getElementById('taskDeadline');
                
                if (taskInput.value && deadlineInput.value) {
                    this.addTask(taskInput.value, deadlineInput.value);
                    const dialog = document.getElementById('task-dialog');
                    if (dialog) {
                        dialog.close();
                        taskInput.value = '';
                        deadlineInput.value = '';
                    }
                    
                    // Перенаправляем на страницу с задачами
                    window.location.href = 'tasks.html';
                }
            });
        }

        // Добавляем обработчик для формы
        const taskForm = document.querySelector('#task-dialog form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskInput = document.getElementById('taskInput');
                const deadlineInput = document.getElementById('taskDeadline');
                
                if (taskInput.value && deadlineInput.value) {
                    this.addTask(taskInput.value, deadlineInput.value);
                    const dialog = document.getElementById('task-dialog');
                    if (dialog) {
                        dialog.close();
                        taskInput.value = '';
                        deadlineInput.value = '';
                    }
                    
                    // Перенаправляем на страницу с задачами
                    window.location.href = 'tasks.html';
                }
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
}); 
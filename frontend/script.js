// Constants
const API_URL = 'http://localhost:5000/api';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksCounter = document.getElementById('tasks-counter');
const allFilterBtn = document.getElementById('all-filter');
const activeFilterBtn = document.getElementById('active-filter');
const completedFilterBtn = document.getElementById('completed-filter');
const clearCompletedBtn = document.getElementById('clear-completed');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    setupEventListeners();
});

function setupEventListeners() {
    todoForm.addEventListener('submit', handleFormSubmit);
    
    allFilterBtn.addEventListener('click', () => filterTodos('all'));
    activeFilterBtn.addEventListener('click', () => filterTodos('active'));
    completedFilterBtn.addEventListener('click', () => filterTodos('completed'));
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// API Functions
async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) throw new Error('Failed to fetch todos');
        
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
        showErrorMessage('Failed to load tasks. Please try again.');
    }
}

async function createTodo(title) {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, completed: false }),
        });
        
        if (!response.ok) throw new Error('Failed to create todo');
        
        const newTodo = await response.json();
        todos.push(newTodo);
        renderTodos();
        return true;
    } catch (error) {
        console.error('Error creating todo:', error);
        showErrorMessage('Failed to add task. Please try again.');
        return false;
    }
}

async function updateTodo(id, updates) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) throw new Error('Failed to update todo');
        
        const updatedTodo = await response.json();
        todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
        renderTodos();
        return true;
    } catch (error) {
        console.error('Error updating todo:', error);
        showErrorMessage('Failed to update task. Please try again.');
        return false;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete todo');
        
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
        return true;
    } catch (error) {
        console.error('Error deleting todo:', error);
        showErrorMessage('Failed to delete task. Please try again.');
        return false;
    }
}

// UI Functions
function renderTodos() {
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-message');
        emptyMessage.textContent = 'No tasks to display';
        todoList.appendChild(emptyMessage);
    } else {
        filteredTodos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    }
    
    updateTasksCounter();
}

function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;
    
    const todoItemContent = document.createElement('div');
    todoItemContent.classList.add('todo-item-content');
    
    const checkbox = document.createElement('span');
    checkbox.classList.add('checkbox');
    if (todo.completed) {
        checkbox.classList.add('checked');
    }
    checkbox.addEventListener('click', () => toggleTodoStatus(todo.id, !todo.completed));
    
    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');
    if (todo.completed) {
        todoText.classList.add('completed');
    }
    todoText.textContent = todo.title;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    todoItemContent.appendChild(checkbox);
    todoItemContent.appendChild(todoText);
    todoItem.appendChild(todoItemContent);
    todoItem.appendChild(deleteBtn);
    
    return todoItem;
}

function updateTasksCounter() {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    tasksCounter.textContent = `${activeTodos} task${activeTodos !== 1 ? 's' : ''} left`;
}

function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active filter button
    [allFilterBtn, activeFilterBtn, completedFilterBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (filter === 'all') {
        allFilterBtn.classList.add('active');
    } else if (filter === 'active') {
        activeFilterBtn.classList.add('active');
    } else if (filter === 'completed') {
        completedFilterBtn.classList.add('active');
    }
    
    renderTodos();
}

function showErrorMessage(message) {
    // You could implement a toast notification here
    alert(message);
}

// Event Handlers
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = todoInput.value.trim();
    if (title === '') return;
    
    createTodo(title);
    todoInput.value = '';
}

function toggleTodoStatus(id, completed) {
    updateTodo(id, { completed });
}

async function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    
    if (completedTodos.length === 0) return;
    
    if (confirm('Are you sure you want to clear all completed tasks?')) {
        try {
            // Delete all completed todos
            for (const todo of completedTodos) {
                await deleteTodo(todo.id);
            }
        } catch (error) {
            console.error('Error clearing completed todos:', error);
            showErrorMessage('Failed to clear completed tasks. Please try again.');
        }
    }
}
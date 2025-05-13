const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const filters = document.getElementsByName('filter');

// Modal
const modal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const search = searchInput.value.toLowerCase();
  const filter = document.querySelector('input[name="filter"]:checked').value;

  taskList.innerHTML = '';

  tasks
    .filter(task => task.text.toLowerCase().includes(search))
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const span = document.createElement('span');
      span.textContent = task.text;
      span.className = 'task-text';
      if (task.completed) span.classList.add('completed');

      const editBtn = document.createElement('button');
      editBtn.innerHTML = '<img src="./img/adicionar.png"></img>';
      editBtn.title = 'Editar tarefa';
      editBtn.className = 'edit-btn';
      editBtn.addEventListener('click', () => {
        editingIndex = index;
        editInput.value = task.text;
        modal.style.display = 'flex';
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<img src="./img/del.png"></img>';
      deleteBtn.title = 'Excluir tarefa';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => {
        if (confirm('Deseja realmente excluir esta tarefa?')) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }
      });

      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
}

// Eventos do modal
saveEditBtn.addEventListener('click', () => {
  const novoTexto = editInput.value.trim();
  if (novoTexto !== '' && editingIndex !== null) {
    tasks[editingIndex].text = novoTexto;
    saveTasks();
    renderTasks();
    modal.style.display = 'none';
    editingIndex = null;
  }
});

cancelEditBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  editingIndex = null;
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    editingIndex = null;
  }
});

// Formulário e filtros
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text !== '') {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
});

searchInput.addEventListener('input', renderTasks);
filters.forEach(f => f.addEventListener('change', renderTasks));

renderTasks();

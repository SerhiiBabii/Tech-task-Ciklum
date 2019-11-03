const btnCreate = document.querySelector('.list__button');
const listInput = document.querySelector('.list__input');
const listSelectStatus = document.querySelector('.list__select-status');
const listSelectPriority = document.querySelector('.list__select-priority');
const modal = document.querySelector('.modal');
const modalSave = document.querySelector('.modal__button-save');
const modalCancel = document.querySelector('.modal__button-cancel');
const body = document.querySelector('body');
const modalFade = document.querySelector('.modal__fade');

let currentIndex = null;
let taskArray = [];

const titleField = document.getElementById('title');
const descriptionField = document.getElementById('description');
const priorityField = document.getElementById('priority');

function clearSearchFields() {
  listInput.value = '';
  listSelectStatus.selectedIndex = 0;
  listSelectPriority.selectedIndex = 0;
}

function createTask(index) {
  if (typeof index === 'number') {
    const { title, description, priority, } = taskArray[index];
    titleField.value = title;
    descriptionField.value = description;
    priorityField.selectedIndex = priority;
    currentIndex = index;
  } else {
    currentIndex = null;
  }

  modal.style.display = 'block';
  titleField.focus();
  clearSearchFields();
}

function deleteTask(index) {
  taskArray = [...taskArray.slice(0, index), ...taskArray.slice(index + 1),];
  createElements(taskArray);
  clearSearchFields();
}

function doneTask(index) {
  const currentDone = !taskArray[index].done;
  taskArray[index] = { ...taskArray[index], done: currentDone, };
  createElements(taskArray);
  clearSearchFields();
}

function addEvents(todoButton, todoButtons, todoButtonsEdit, todoButtonDelete, todoButtonDone) {
  function showTodoBurrons(index) {
    const todoButtonsArray = todoButtons;
    todoButtonsArray[index].style.display = todoButtons[index].style.display === 'none' ? 'flex' : 'none';
  }

  todoButtons.forEach((element) => {
    const thisElement = element;
    thisElement.style.display = 'none';
  });

  todoButton.forEach((element, index) => {
    element.addEventListener('click', () => showTodoBurrons(index));
  });

  todoButtonsEdit.forEach((element, index) => {
    element.addEventListener('click', () => createTask(index));
  });

  todoButtonDelete.forEach((element, index) => {
    element.addEventListener('click', () => deleteTask(index));
  });

  todoButtonDone.forEach((element, index) => {
    element.addEventListener('click', () => doneTask(index));
  });
}

function createElements(arrElements) {
  const result = document.querySelector('.todo');

  let out = '';

  if (arrElements.length > 0) {
    arrElements.forEach((element) => {
      const todoDoneClassName = element.done === true ? 'todo__done ' : '';
      out += `<div class="todo__elements ${todoDoneClassName}">`;
      out += `<p class="todo__title">${element.title}</p>`;
      out += `<p class="todo__descriptions">${element.description}</p>`;
      out += '<div class="todo__wrapper">';
      out += `<p class="todo__priority">${element.priority}</p>`;
      out += '<button class="todo__button">...</button>';
      out += '<div class="todo__buttons">';
      out += '<button class="todo__buttons-done">done</button>';
      out += '<button class="todo__buttons-edit">edit</button>';
      out += '<button class="todo__buttons-delete">delete</button>';
      out += '</div>';
      out += '</div>';
      out += '</div>';
      result.innerHTML = out;
    });
  } else {
    result.innerHTML = '';
  }

  const todoButton = document.querySelectorAll('.todo__button');
  const todoButtons = document.querySelectorAll('.todo__buttons');
  const todoButtonsEdit = document.querySelectorAll('.todo__buttons-edit');
  const todoButtonDelete = document.querySelectorAll('.todo__buttons-delete');
  const todoButtonDone = document.querySelectorAll('.todo__buttons-done');

  addEvents(todoButton, todoButtons, todoButtonsEdit, todoButtonDelete, todoButtonDone);
}

function clearInputs() {
  titleField.value = '';
  descriptionField.value = '';
  priorityField.selectedIndex = 0;
}

function saveTask(index) {
  const emptyCondition = titleField.value.trim() !== '' && descriptionField.value.trim() !== '';
  const valueCondition = titleField.value && descriptionField.value && priorityField.value;

  if (valueCondition && emptyCondition) {
    if (typeof index === 'number') {
      taskArray[index] = {
        title: titleField.value,
        description: descriptionField.value,
        priority: priorityField.value,
        done: false,
      };
    } else {
      taskArray.push({
        title: titleField.value,
        description: descriptionField.value,
        priority: priorityField.value,
        done: false,
      });
    }

    clearInputs();
    createElements(taskArray);
    currentIndex = null;
    modal.style.display = 'none';
    clearSearchFields();
  } else {
    alert('Please fill out the form');
  }
}

function cancelTask() {
  clearInputs();
  modal.style.display = 'none';
  clearSearchFields();
}

function selectStatus(value, arr) {
  let currentArr = [];

  if (value === 'done') {
    currentArr = arr.filter((element) => element.done === true);
  } else if (value === 'open') {
    currentArr = arr.filter((element) => element.done === false);
  } else if (value === 'all') {
    currentArr = arr;
  }

  return currentArr;
}

function selectPriority(value, arr) {
  let currentArr = [];

  if (value === 'high') {
    currentArr = arr.filter((element) => element.priority === 'high');
  } else if (value === 'normal') {
    currentArr = arr.filter((element) => element.priority === 'normal');
  } else if (value === 'low') {
    currentArr = arr.filter((element) => element.priority === 'low');
  } else if (value === 'all') {
    currentArr = arr;
  }

  return currentArr;
}

function changeListInput(value, arr) {
  let currentArr = [];

  currentArr = arr.filter((element) => {
    return element.title.indexOf(value) > -1;
  });

  return currentArr;
}

function filterInput(e) {
  let newArr = [];

  if (e.target.name === 'list-input') {
    newArr = taskArray.filter((element) => {
      const { value, } = e.target;
      return element.title.indexOf(value) > -1;
    });
    newArr = selectStatus(listSelectStatus.value, newArr);
    newArr = selectPriority(listSelectPriority.value, newArr);
  }

  if (e.target.name === 'status') {
    if (e.target.value === 'done') {
      newArr = taskArray.filter((element) => element.done === true);
    } else if (e.target.value === 'open') {
      newArr = taskArray.filter((element) => element.done === false);
    } else if (e.target.value === 'all') {
      newArr = taskArray;
    }

    newArr = changeListInput(listInput.value, newArr);
    newArr = selectPriority(listSelectPriority.value, newArr);
  }

  if (e.target.name === 'priority') {
    if (e.target.value === 'high') {
      newArr = taskArray.filter((element) => element.priority === 'high');
    } else if (e.target.value === 'normal') {
      newArr = taskArray.filter((element) => element.priority === 'normal');
    } else if (e.target.value === 'low') {
      newArr = taskArray.filter((element) => element.priority === 'low');
    } else if (e.target.value === 'all') {
      newArr = taskArray;
    }

    newArr = changeListInput(listInput.value, newArr);
    newArr = selectStatus(listSelectStatus.value, newArr);
  }

  createElements(newArr);
}

function cancelWithEsc(e) {
  if (e.keyCode === 27) {
    cancelTask();
  }
}

btnCreate.addEventListener('click', createTask);
modalSave.addEventListener('click', () => saveTask(currentIndex));
modalCancel.addEventListener('click', cancelTask);

body.addEventListener('keyup', cancelWithEsc);

modalFade.addEventListener('click', cancelTask);

listSelectStatus.addEventListener('change', filterInput);
listSelectPriority.addEventListener('change', filterInput);
listInput.addEventListener('input', filterInput);

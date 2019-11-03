const btnCreate = document.querySelector('.list__button');
const listInput = document.querySelector('.list__input');
const listSelectStatus = document.querySelector('.list__select-status');
const listSelectPriority = document.querySelector('.list__select-priority');
const modal = document.querySelector('.modal');
const modalSave = document.querySelector('.modal__button-save');
const modalCancel = document.querySelector('.modal__button-cancel');
const body = document.querySelector('body');
const modalFade = document.querySelector('.modal__fade');

let currentId = null;
let taskArray = [];
let idForArrayItems = 0;

const titleField = document.getElementById('title');
const descriptionField = document.getElementById('description');
const priorityField = document.getElementById('priority');

function findArrayElement(arr, id) {
  let currentElement = null;
  arr.forEach((element) => {
    if (element.id === Number(id)) {
      currentElement = element;
    }
  });
  return currentElement;
}

function replaceArrayElement(array, item) {
  const newArr = array.map((element) => {
    if (element.id === item.id) {
      return item;
    }
    return element;
  });
  return newArr;
}

function removeArrayElement(array, item) {
  const newArr = array.filter((element) => element.id !== item.id);
  return newArr;
}

function clearSearchFields() {
  listInput.value = '';
  listSelectStatus.selectedIndex = 0;
  listSelectPriority.selectedIndex = 0;
}

function createTask(index) {
  if (typeof index === 'number' && !Number.isNaN(index)) {
    const currentElement = findArrayElement(taskArray, index);
    const { title, description, priority, id, } = currentElement;
    titleField.value = title;
    descriptionField.value = description;
    priorityField.value = priority;
    currentId = id;
  } else {
    currentId = null;
  }

  modal.style.display = 'block';
  titleField.focus();
  clearSearchFields();
}

function deleteTask(index) {
  const currentElement = findArrayElement(taskArray, index);
  taskArray = removeArrayElement(taskArray, currentElement);
  createElements(taskArray);
  clearSearchFields();
}

function doneTask(index) {
  let currentElement = findArrayElement(taskArray, index);
  const currentDone = !currentElement.done;
  currentElement = { ...currentElement, done: currentDone, };
  taskArray = replaceArrayElement(taskArray, currentElement);
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

  todoButtonsEdit.forEach((element) => {
    element.addEventListener('click', () => createTask(Number(element.name)));
  });

  todoButtonDelete.forEach((element) => {
    element.addEventListener('click', () => deleteTask(element.name));
  });

  todoButtonDone.forEach((element) => {
    element.addEventListener('click', () => doneTask(element.name));
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
      out += `<button class="todo__buttons-done" name=${element.id}>done</button>`;
      out += `<button class="todo__buttons-edit" name=${element.id}>edit</button>`;
      out += `<button class="todo__buttons-delete" name=${element.id}>delete</button>`;
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
    if (typeof index === 'number' && !Number.isNaN(index)) {
      let currentElement = findArrayElement(taskArray, index);
      currentElement = {
        ...currentElement,
        title: titleField.value,
        description: descriptionField.value,
        priority: priorityField.value,
        done: false,
      };
      taskArray = replaceArrayElement(taskArray, currentElement);
    } else {
      idForArrayItems += 1;
      taskArray.push({
        title: titleField.value,
        description: descriptionField.value,
        priority: priorityField.value,
        done: false,
        id: idForArrayItems,
      });
    }

    clearInputs();
    createElements(taskArray);
    currentId = null;
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
modalSave.addEventListener('click', () => saveTask(currentId));
modalCancel.addEventListener('click', cancelTask);

body.addEventListener('keyup', cancelWithEsc);

modalFade.addEventListener('click', cancelTask);

listSelectStatus.addEventListener('change', filterInput);
listSelectPriority.addEventListener('change', filterInput);
listInput.addEventListener('input', filterInput);

//  pulling elements from dom
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// display items function
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDom(item);
    checkUI();
  })
}

// addItem function
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // validate Input
  if(newItem === '') {
    alert('please input an item');
    return;
  }

  // check for edit mode 
  if(isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }  else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return itemInput.value = '';
    }
  }
 // Create item DOM element

 addItemToDom(newItem);
 addItemToStorage(newItem);

  checkUI();
  itemInput.value = '';
}

function addItemToDom(item) {
 // create list item
 const li = document.createElement('li');
 li.appendChild(document.createTextNode(item));
 const button = createButton('remove-item btn-link text-red');
 li.appendChild(button);
 itemList.appendChild(li);
}

function addItemToStorage(item) {
  let itemsFromStorage;
  if(localStorage.getItem('items') === null) {
  itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  // add new item to array
  itemsFromStorage.push(item);
  // convert to json string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// function get items from storage
function getItemsFromStorage() {
  let itemsFromStorage;
  if(localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}
// function create icon for button

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
 setItemToEdit(e.target);
  }
}
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
isEditMode = true;
itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
item.classList.add('edit-mode');
formBtn.innerHTML = `<i class="fa-solid fa-pen"></i>   Update  Item`;
formBtn.style.backgroundColor = '#228B22';
itemInput.value = item.textContent;
}
// remove an item from a list function
function removeItem(item) {
    if(confirm('Are you sure ?')) {
     
      // Remove item
      item.remove();
         // Remove item from storage
    removeItemFromStorage(item.textContent);
      checkUI();
    }
}
// function remove items from localstorage 
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Reset to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}
// remove all items function
function clearItems() {
  while(itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  
   // Clear from localStorage
   localStorage.removeItem('items');
  checkUI();
}
function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if(itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  })
}

// check user interface
function checkUI() {
  const items = itemList.querySelectorAll('li');
  if(items.length === 0) {
  clearBtn.style.display = 'none';
  itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initialize app
function init() {
// add event listeners to addItem function
itemForm.addEventListener('submit', onAddItemSubmit);
// add event listener to remove item function
itemList.addEventListener('click', onClickItem);
// clear all items in the list function
clearBtn.addEventListener('click', clearItems);
//  filter items function add event listeners
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);
checkUI();
}
init();


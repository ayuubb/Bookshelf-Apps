const UNCOMPLETED_BOOK_LIST_ID = 'incompleteBookshelfList';
const COMPLETED_BOOK_LIST_ID = 'completeBookshelfList';
const BOOK_ITEMID = 'itemId';

function makeListBook(title, author, year, isComplete) {
  const bookTitle = document.createElement('h2');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('span');
  bookAuthor.setAttribute('id', 'bookAuthor');
  bookAuthor.innerText = author;

  const bookAuthorText = document.createElement('p');
  bookAuthorText.innerText = 'Penulis : ';
  bookAuthorText.append(bookAuthor);

  const bookYear = document.createElement('span');
  bookYear.setAttribute('id', 'bookYear');
  bookYear.innerText = year;

  const bookYearText = document.createElement('p');
  bookYearText.innerText = 'Tahun : ';
  bookYearText.append(bookYear);

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(bookTitle, bookAuthorText, bookYearText);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  if (isComplete) {
    buttonContainer.append(createUndoButton(), createDeleteButton());
  } else {
    buttonContainer.append(createFinishButton(), createDeleteButton());
  }
  article.append(buttonContainer);

  return article;
}

function createFinishButton() {
  return createButton('green', 'Selesai dibaca', function (event) {
    addBookToFinish(event.target.parentElement.parentNode);
  });
}

function createDeleteButton() {
  return createButton('red', 'Hapus buku', function (event) {
    removeBook(event.target.parentElement.parentNode);
  });
}

function createUndoButton() {
  return createButton('green', 'Belum Selesai dibaca', function (event) {
    undoFinishBook(event.target.parentElement.parentNode);
  });
}

function createButton(buttonTypeClass, buttonName, eventListener) {
  const button = document.createElement('button');

  button.classList.add(buttonTypeClass);
  button.addEventListener('click', function (event) {
    eventListener(event);
    event.stopPropagation();
  });

  const btnText = document.createTextNode(buttonName);
  button.appendChild(btnText);

  return button;
}

function addBook() {
  const incompleteBookshelf = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
  const completeBookshelf = document.getElementById(COMPLETED_BOOK_LIST_ID);

  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const book = makeListBook(title, author, year, isComplete);
  const bookObject = composeBookObject(title, author, year, isComplete);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  if (isComplete) {
    completeBookshelf.append(book);
  } else {
    incompleteBookshelf.append(book);
  }

  updateDataToStorage();
  clearInput();
}

function refreshData() {
  const incompleteBookshelf = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
  const completeBookshelf = document.getElementById(COMPLETED_BOOK_LIST_ID);

  const completeExistList = completeBookshelf.querySelectorAll('article');
  if (completeExistList.length > 0) {
    for (completeList of completeExistList) {
      completeList.remove();
    }
  }

  const incompleteExistList = incompleteBookshelf.querySelectorAll('article');
  if (incompleteExistList.length > 0) {
    for (incompleteList of incompleteExistList) {
      incompleteList.remove();
    }
  }

  for (book of books) {
    const newBook = makeListBook(book.title, book.author, book.year, book.isCompleted);
    newBook[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      completeBookshelf.append(newBook);
    } else {
      incompleteBookshelf.append(newBook);
    }
  }
}

function clearInput() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
}

function addBookToFinish(taskElement) {
  const completeBookshelf = document.getElementById(COMPLETED_BOOK_LIST_ID);

  const bookTitle = taskElement.querySelector('.book_item > h2').innerText;
  const bookAuthor = taskElement.querySelector('.book_item > p > span#bookAuthor').innerText;
  const bookYear = taskElement.querySelector('.book_item > p > span#bookYear').innerText;
  const bookId = taskElement[BOOK_ITEMID];

  const newFinishBook = makeListBook(bookTitle, bookAuthor, bookYear, true);

  const book = findBook(bookId);
  book.isCompleted = true;
  newFinishBook[BOOK_ITEMID] = book.id;

  completeBookshelf.append(newFinishBook);
  taskElement.remove();
  updateDataToStorage();
  document.dispatchEvent(new Event('bookChanged'));
}

function removeBook(taskElement) {
  const confirmDelete = confirm('anda yakin menghapus buku ini?');

  if (confirmDelete === true) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
    alert('Hapus buku berhasil');
  } else {
    console.log('Batal hapus buku....');
    document.dispatchEvent(new Event('bookChanged'));
  }
}

function undoFinishBook(taskElement) {
  const incompleteBookshelf = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);

  const bookTitle = taskElement.querySelector('.book_item > h2').innerText;
  const bookAuthor = taskElement.querySelector('.book_item > p > span#bookAuthor').innerText;
  const bookYear = taskElement.querySelector('.book_item > p > span#bookYear').innerText;
  const bookId = taskElement[BOOK_ITEMID];

  const undoFinishBook = makeListBook(bookTitle, bookAuthor, bookYear, false);

  const book = findBook(bookId);
  book.isCompleted = false;
  undoFinishBook[BOOK_ITEMID] = book.id;

  incompleteBookshelf.append(undoFinishBook);
  taskElement.remove();
  updateDataToStorage();
  document.dispatchEvent(new Event('bookChanged'));
}

function searchBook() {
  const incompleteBookshelf = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
  const completeBookshelf = document.getElementById(COMPLETED_BOOK_LIST_ID);
  const searchKey = document.getElementById('searchBookTitle').value;
  const textKey = document.getElementById('searchText');

  const bookFilter = books.filter((book) => book.title.toLowerCase().includes(searchKey.toLowerCase()));

  const completeExistList = completeBookshelf.querySelectorAll('article');
  for (completeList of completeExistList) {
    completeList.remove();
  }

  const incompleteExistList = incompleteBookshelf.querySelectorAll('article');
  for (incompleteList of incompleteExistList) {
    incompleteList.remove();
  }

  if (bookFilter.length > 0) {
    textKey.innerText = `kami menemukan ${bookFilter.length} buku dengan kata kunci "${searchKey}"`;
  } else {
    textKey.innerText = `kami tidak dapat menemukan buku dengan kata kunci "${searchKey}"`;
  }

  for (book of bookFilter) {
    const searchBook = makeListBook(book.title, book.author, book.year, book.isCompleted);
    searchBook[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      completeBookshelf.append(searchBook);
    } else {
      incompleteBookshelf.append(searchBook);
    }
  }
  document.getElementById('searchBookTitle').value = '';
}

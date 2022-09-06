document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener('ondatasaved', () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener('ondataloaded', () => {
  refreshData();
});

document.addEventListener('bookChanged', () => {
  refreshData();
});

const searchForm = document.getElementById('searchBook');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  searchBook();
});

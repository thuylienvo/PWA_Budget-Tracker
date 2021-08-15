// variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('budgettrack', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budgettrack', { autoIncrement: true });
  };
  
// upon a successful 
  request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
      uploadBudgetTrack();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };
  
  // save transaction
  function saveRecord(record) {
    const transaction = db.transaction(['new_budgettrack'], 'readwrite');
  
    const budgetObjectStore = transaction.objectStore('new_budgettrack');
  
    // add record to your store with add method.
    budgetObjectStore.add(record);
  }
  
  function uploadBudget() {
    // open a transaction on your pending db
    const transaction = db.transaction(['new_budgettrack'], 'readwrite');
  
    // access your pending object store
    const budgetObjectStore = transaction.objectStore('new_pizza');
  
    // get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
  
    getAll.onsuccess = function() {
      // if there was data in indexedDb's store, let's send it to the api server
      if (getAll.result.length > 0) {
        fetch('/api/transaction', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(serverResponse => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
  
            const transaction = db.transaction(['ew_budgettrack'], 'readwrite');
            const pizzaObjectStore = transaction.objectStore('new_budgettrack');
            // clear all items in your store
            budgetObjectStore.clear();
          })
          .catch(err => {
            // set reference to redirect back here
            console.log(err);
          });
      }
    };
  }
  
  // listen for app coming back online
  window.addEventListener('online', uploadBudget);
  
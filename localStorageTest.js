function testLocalStorage() {
  try {
    localStorage.setItem('DirectlyLocalStorage', 'True');
const testLocalStorage = window.localStorage;
console.log(testLocalStorage);
}
catch(err) {
  console.log("No Access to Local Storage");
}
}

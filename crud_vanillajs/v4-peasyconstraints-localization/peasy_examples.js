/*
 docs :
 https://www.npmjs.com/package/peasy-js
 https://embed.plnkr.co/plunk/IszynC
 https://www.sitepoint.com/reusable-javascript-business-logic-peasy-js/

*/

// FIRST PASS
// var personService = new PersonService(new PersonDataProxy());
// var command = personService.insertCommand({name: "James Morrison"});

// command.execute().then(result => {
//   if (result.success) {
//     console.log(result.value); // prints the inserted object with the assigned id
//   }
// });


// SECOND PASS
// var dataProxy = new PersonDataProxy();
// var personService = new PersonService(dataProxy);
// var command = personService.insertCommand({name: "Jimi Hendrix"});

// command.execute().then(result => {
//   if (result.success) {
//     console.log(result.value);
//   } else {
//     console.log(result.errors[0]); // prints {association: "name", message: "Name cannot be Jimi Hendrix"}
//   }
// });


// THIRD PASS
// var dataProxy = new PersonDataProxy();
// var personService = new PersonService(dataProxy);
// var command = personService.insertCommand({name: "Jimi Hendrix", city: "Nowhere"});

// command.execute().then(result => {
//   if (result.success) {
//     console.log(result.value);
//   } else {
//     console.log(result.errors[0]); // prints {association: "name", message: "Name cannot be Jimi Hendrix"}
//     console.log(result.errors[1]); // prints {association: "city", message: "Nowhere is not a city"}
//   }
// });


// FOURTH PASS
/*
var dataProxy = new PersonDataProxy();
var personService = new PersonService(dataProxy);

var datas1 = {name: "James Hendrix", city: "Madison"};

var command = personService.insertCommand(datas1);

command.execute().then(result => {
  if (result.success) {
    console.log(result.value); // prints the inserted object with the assigned id
  } else {
    console.log(result.errors);
  }
});

var datas2 = {name: "James Hendrix", city: "Nowhere"};

var command = personService.insertCommand(datas2);

command.execute().then(result => {
  if (result.success) {
    console.log(result.value); // prints the inserted object with the assigned id
  } else {
    console.log(result.errors);
  }
});
*/

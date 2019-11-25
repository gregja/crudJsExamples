# CRUD module in VanillaJS - V4 (constraints + PeasyJS + localization)


a CRUD module written in VanillaJS, using Peasy.js.
Peasy.js is a business logic micro-framework for javascript.

it's possible to combine the HTML5 controls on the formulary,
with the contrôls managed by Peasy.js.

Ta activate the HTML5 controls, just uncomment the lines below of the "starter.js" file :

```javascript
// TODO : uncomment the lines below, to see how controls work, with and without HTML5 validation
//        because PeasyJs check the values in all cases
let constraints = {
//    title: {maxlength:"100", required:"required"},
//    author: {maxlength:"40", required:"required"},
//    isbn: {minlength:"13", maxlength:"13", required:"required"},
//    price: {type:"number", min:".01", max:"20000", step:".01", required:"required"},
    shop: {type:"select", options:[{code:'shop01', desc:'shop 1'}, {code:'shop02', desc:'shop 2'}, {code:'shop03', desc:'shop 3'}]}
};
```

You can compare the parameters of the HTML5 controls with the same contrôls
parametrized for Peasy.js, in the beginning of the file "ProducRules.js":

```javascript
var productRules = {
    title: {maxlength: 100, required: true},
    author: {maxlength: 40, required: true},
    isbn: {minlength: 13, maxlength: 13, required: true, unique:true},
    price: {type: "number", min: .01, max: 20000, decPrecision: 2, required: true},
    shop: {
        type: "select",
        options: [{code: 'shop01', desc: 'shop 1'}, {code: 'shop02', desc: 'shop 2'}, {code: 'shop03', desc: 'shop 3'}]
    }
};
```

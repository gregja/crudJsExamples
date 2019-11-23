var entityManager = (function () {
    "use strict";

    var self = this;

    // variables initialised in init() function
    var name_entity, key_entity, fields, field_key, store;
    var container, main_container, submit_button, form_container;
    var constraints = {};
    var crud_key_field, crud_action_field;
    var crud_key_list;
    var title_entity = '';
    var selectedRow = null;

    var locale = '';  // initialized in "init" function
    var localize = {};  // enriched in "init" function if transmitted in parameter
    localize.en = {
        allrequired: 'Please fill in all fields',
        novalid: 'Correct the form, please',
        list_button_edit: 'Edit',
        list_button_delete: 'Drop',
        form_button_cancel: 'Cancel',
        form_button_create: 'Submit creation',
        form_button_update: 'Submit edition',
        form_button_delete: 'Submit delete'
    };
    localize.en_EN = JSON.parse(JSON.stringify(localize.en));
    localize.en_US = JSON.parse(JSON.stringify(localize.en));
    localize.fr = {
        allrequired: 'Remplissez tous les champs SVP',
        novalid: 'Corrigez le formulaire SVP',
        list_button_edit: 'Editer',
        list_button_delete: 'Supprimer',
        form_button_cancel: 'Annuler',
        form_button_create: 'Soumettre création',
        form_button_update: 'Soumettre mise à jour',
        form_button_delete: 'Soumettre suppression'
    };
    localize.fr_FR = JSON.parse(JSON.stringify(localize.fr));
    localize.fr_BE = JSON.parse(JSON.stringify(localize.fr));

    var number_of_decs = 2;    // enriched in "init" function if transmitted in parameter
    var monetary_symbol = '';  // enriched in "init" function if transmitted in parameter
    var comma_separator = '.'; // enriched in "init" function if transmitted in parameter

    var messages = {};  // initialized in "init" function

    /**
     * Capitalize the data
     * @param string
     * @returns {string}
     */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    class Model {
        constructor(datas) {
            let keys = Object.keys(datas);
            keys.forEach(key => {
                this[key] = datas[key];
            });
        }
    }

    /**
     * Handles UI tasks
     */
    class UI {

        static displayItems() {
            const items = store.getItems();

            items.forEach((item) => UI.addItemToList(item));
        }

        static addItemToList(item) {

            let key = `${item[field_key]}`;
            const row = document.createElement('tr');
            row.setAttribute('data-rowid', key);

            var columns = '';
            fields.forEach(elt => {
                let data = item[elt];
                let value = '';
                let type = 'text';
                if (item.hasOwnProperty(elt)) {
                    if (constraints.hasOwnProperty(elt) && constraints[elt].hasOwnProperty('type')) {
                        type = constraints[elt].type;
                        if (type == 'number') {
                            value = formatNumber(data, number_of_decs, monetary_symbol);
                        } else {
                            value = data;
                        }
                    } else {
                        value = data;
                    }
                }
                columns += `<td data-content="${data}" data-key="${elt}" data-type="${type}">${value}</td>`;
            });

            row.innerHTML = `${columns}
      <td><a href="#" class="btn btn-success btn-sm" data-action="edit" data-id="${key}">${localize[locale].list_button_edit}</a></td>
      <td><a href="#" class="btn btn-danger btn-sm" data-action="delete" data-id="${key}">${localize[locale].list_button_delete}</a></td>
    `;
            crud_key_list.appendChild(row);
        }

        static editItemToList(list) {
            fields.forEach((item, index) => {
                let selected = selectedRow.children[index];
                selected.dataset['content'] = list[item];
                if (selected.dataset['type'] == 'number') {
                    selected.textContent = formatNumber(list[item], number_of_decs, monetary_symbol);
                } else {
                    selected.textContent = list[item];
                }
            });
        }

        static deleteItem(el) {
            submit_button.value = localize[locale].form_button_delete;
            selectedRow = el.parentElement.parentElement;
            fields.forEach((item, index) => {
                let field = form_container.querySelector('[data-field=' + item + ']');
                field.value = selectedRow.children[index].dataset['content'];
                field.setAttribute('disabled', 'disabled');
            });
            let key = el.dataset.id;

            crud_key_field.value = key;
            crud_action_field.value = 'delete';
        }

        static editItem(el) {
            submit_button.value = localize[locale].form_button_update;
            selectedRow = el.parentElement.parentElement;
            fields.forEach((item, index) => {
                form_container.querySelector('[data-field=' + item + ']').value = selectedRow.children[index].dataset['content'];
            });
            let key = el.dataset.id;

            // in edit mode, we protect the field corresponding to the unique key of the model
            let protectField = form_container.querySelector('[data-field=' + field_key + ']');
            if (protectField != undefined) {
                protectField.setAttribute('disabled', 'disabled');
            }

            crud_key_field.value = key;
            crud_action_field.value = 'edit';
        }

        static showAlert(message, className) {
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;

            div.appendChild(document.createTextNode(message));
            const main = main_container.querySelector('.main');
            main_container.insertBefore(div, main);
            setTimeout(() => main_container.querySelector('.alert').remove(), 3000);
        }

        static clearFields() {
            submit_button.value = localize[locale].form_button_create;

            fields.forEach((item, index) => {
                let field = form_container.querySelector('[data-field=' + item + ']');
                field.value = '';
                if (field.hasAttribute('disabled')) {
                    field.removeAttribute('disabled');
                }
            });

            crud_key_field.value = '';
            crud_action_field.value = 'add';
        }
    }

    /**
     * Store Class: Handles Storage
     */
    class Store {

        constructor(store_name, field_key) {
            this.store_name = store_name;
            this.field_key = field_key;
        }

        getItems() {
            let items;
            if (localStorage.getItem(this.store_name) === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem(this.store_name));
            }

            return items;
        }

        addItem(item) {
            let items = store.getItems();
            items.push(item);
            localStorage.setItem(this.store_name, JSON.stringify(items));
        }

        updateItem(key, data) {
            // we delete and recreate the item in the store
            let items = store.getItems();
            for (let index=0, imax=items.length; index<imax; index++) {
                let item = items[index];
                if (item[this.field_key] == key) {
                    items[index] = data;
                }
            }

            localStorage.setItem(this.store_name, JSON.stringify(items));
        }

        removeItem(key) {
            let items = store.getItems();

            items.forEach((item, index) => {
                if (item[this.field_key] === key) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem(this.store_name, JSON.stringify(items));
        }

        clearStore() {
            localStorage.clear(this.store_name);
        }
    }

    function generateForm() {
        let columns = '';
        fields.forEach(elt => {
            let field_type = 'text';
            let field_html = '';
            let seloptions = [];  // for field type "select" only
            let str_constraints = '';
            if (constraints.hasOwnProperty(elt)) {
                let ctraints = [];
                for (let ctr in constraints[elt]) {
                    if (ctr == "type") {
                        field_type = constraints[elt][ctr];
                        if (field_type == "select") {
                            seloptions = constraints[elt]['options'];
                        }
                    } else {
                        ctraints.push(`${ctr}="${constraints[elt][ctr]}"`);
                    }
                }
                str_constraints = ctraints.join(' ');
            }

            if (field_type == "select") {
                let options_html = [];
                seloptions.forEach(item => {
                    options_html.push(`<option value="${item.code}">${item.desc}</option>`);
                });
                field_html = `<select data-field="${elt}" class="form-control" ${str_constraints}>${options_html.join('\n')}</select>`;
            } else {
                field_html = `<input type="${field_type}" data-field="${elt}" class="form-control" ${str_constraints}>`;
            }

            let translated_elt = translate(elt);
            columns += `<div class="form-group">
                    <label class="col-md-12">${translated_elt}
                    ${field_html}
                    </label>
                </div>`;
        });

        form_container.innerHTML = `${columns}
    <div class="form-group">
        <input type="hidden" value="" data-id="crud-key">
        <input type="hidden" value="" data-id="crud-action">
        <label class="col-md-12">
        <input type="submit" value="Submit creation" data-id="submit-button" class="btn btn-success btn-block" >
        <input type="button" value="${localize[locale].form_button_cancel}" data-id="cancel-button" class="btn btn-secondary btn-block" >
        </label>
    </div>`;
    }

    /**
     * Translate data if it exists or return the same data with capitalization
     * @param elt
     * @returns {*|string}
     */
    function translate(elt) {
        let data = '';
        if (localize[locale].hasOwnProperty(elt)) {
            data = localize[locale][elt];
        } else {
            data = capitalize(elt);
        }
        return data;
    }

    /**
     * Format Number in the list
     * @param data
     * @param dec
     * @param monetarySymbol
     * @returns {string}
     */
    function formatNumber(data, dec=2, monetarySymbol='') {
        // on pointe sur l'élément du DOM qui est à
        // l'origine de l'évènement
        var value = parseFloat(data);
        var mult =  Math.pow(10,dec);
        var cv = Math.floor(value * mult).toString();
        if (cv.length < dec+1) {
            cv = "0".repeat(dec+1);
        }
        var fmtdata = monetarySymbol + cv.substr(0, cv.length - dec) + comma_separator +
            cv.substr(cv.length - dec, dec);
        return fmtdata;
    }

    /**
     * Initialize the CRUD module
     * @param param
     * @returns {*}
     */
    function init(param) {
        locale = param.locale || 'en_EN';
        if (!localize.hasOwnProperty(locale)) {
            console.warn('Locale not correct, taken "en_EN" by default');
            locale = 'en_EN';
        }

        if (param.hasOwnProperty('localize')) {
            for (let specific_locale in param.localize) {
                if (!localize.hasOwnProperty(specific_locale)) {
                    localize[specific_locale] = {};
                }
                for (let specific_data in param.localize[specific_locale]) {
                    localize[specific_locale][specific_data] = param.localize[specific_locale][specific_data]
                }
            }
        }
        // console.log(localize);

        messages.allrequired = localize[locale].allrequired;
        messages.novalid = localize[locale].novalid;

        if (param.hasOwnProperty('numberOfDecs') && param.numberOfDecs.hasOwnProperty(locale)) {
            number_of_decs = param.numberOfDecs[locale];
        }
        if (param.hasOwnProperty('monetarySymbol') && param.monetarySymbol.hasOwnProperty(locale)) {
            monetary_symbol = param.monetarySymbol[locale];
        }
        if (param.hasOwnProperty('commaSeparator') && param.commaSeparator.hasOwnProperty(locale)) {
            comma_separator = param.commaSeparator[locale];
        }

        title_entity = param.title;
        name_entity = param.entityName;
        key_entity = param.entityKey;
        fields = param.fields;
        field_key = param.fieldKey;
        constraints = param.constraints || {};

        container = key_entity + '-crud-container';

        messages.deleted = `${name_entity} deleted`;
        messages.added = `${name_entity} added`;
        messages.edited = `${name_entity} edited`;

        //---- FIND THE MAIN CONTAINER
        main_container = document.getElementById(container);
        if (main_container == undefined) {
            console.error('DOM target not found for ID ' + container);
            return;
        }

        //---- SET THE HEADER OF THE TABLE
        let header_key = `[data-id=table-header]`;
        let list_header = main_container.querySelector(header_key);
        if (list_header == undefined) {
            console.error('DOM target not found for ID ' + header_key);
        } else {
            let columns = '';
            fields.forEach(elt => {
                let translated_elt = translate(elt);
                columns += `<th>${translated_elt}</th>`;
            });
            list_header.innerHTML = `<tr>
                    ${columns}
                    <th></th>
                    <th></th>
                </tr>`;
        }

        //---- SET THE TITLE
        let title_key_target = `[data-id=title]`;
        let title_target = main_container.querySelector(title_key_target);
        if (title_target == undefined) {
            console.error('DOM target not found for ID ' + title_key_target);
        } else {
            title_target.innerHTML = title_entity;
        }

        //---- GENERATE THE FORM
        var form_container_key = '[data-id=crud-form]'
        form_container = main_container.querySelector(form_container_key);
        if (form_container == undefined) {
            console.error('DOM target not found for ID ' + form_container_key);
        } else {

            generateForm();

            form_container.addEventListener('submit', (e) => {
                // Prevent actual submit
                e.preventDefault();

                let form_values = {};
                let form_errors = [];

                fields.forEach((item, index) => {
                    let form_item = form_container.querySelector('[data-field=' + item + ']');
                    if (!form_item.checkValidity()) {
                        form_errors.push(item + ' : ' + form_item.validationMessage);
                    }
                    form_values[item] = String(form_item.value).trim();
                });

                // Validate

                if (form_errors.length > 0) {
                    UI.showAlert(form_errors.join('<br>'), 'danger');
                } else {
                    // Instatiate Model
                    const item = new Model(form_values);
                    if (crud_action_field.value == 'add') {
                        store.addItem(item);
                        // Add item to UI
                        UI.addItemToList(item);
                        selectedRow = null;
                        UI.showAlert(messages.added, 'success');
                    } else {
                        if (crud_action_field.value == 'delete') {
                            let key = crud_key_field.value;
                            store.removeItem(key);
                            //
                            let search_row = crud_key_list.querySelector(`[data-rowid="${key}"]`);
                            if (search_row) {
                                search_row.parentNode.removeChild(search_row);
                            }

                            UI.showAlert(messages.deleted, 'danger');
                        } else {
                            let key = crud_key_field.value;
                            store.updateItem(key, item);
                            UI.editItemToList(item);
                            selectedRow = null;
                            UI.showAlert(messages.edited, 'info');
                        }
                    }
                    // Clear fields
                    UI.clearFields();

                }
            });

            // Event: Remove an item
            var crud_dom_key_list = `[data-id=table-list]`;
            crud_key_list = main_container.querySelector(crud_dom_key_list);
            if (crud_key_list == undefined) {
                console.error('DOM target not found for ID ' + crud_dom_key_list);
            } else {
                crud_key_list.addEventListener('click', (e) => {
                    let node = e.target;
                   // if (el.dataset.action)
                    if (node.dataset.action) {
                        if (node.dataset.action == 'delete') {
                            UI.deleteItem(e.target);
                        }
                        if (node.dataset.action == 'edit') {
                            UI.editItem(e.target);
                        }
                    }
                });
            }

            submit_button = main_container.querySelector('[data-id=submit-button]');
            if (submit_button == undefined) {
                console.error('DOM target not found for submit-button');
            }

            let cancel_button = main_container.querySelector('[data-id=cancel-button]');
            if (cancel_button == undefined) {
                console.error('DOM target not found for cancel-button');
            } else {
                cancel_button.addEventListener('click', (e) => {
                    UI.clearFields();
                });
            }

            crud_key_field = main_container.querySelector('[data-id=crud-key]');
            if (crud_key_field == undefined) {
                console.error('DOM target not found for crud-key');
            }
            crud_action_field = main_container.querySelector('[data-id=crud-action]');
            if (crud_action_field == undefined) {
                console.error('DOM target not found for crud-action');
            }

            //---- SET STORE IN LOCAL STORAGE
            store = new Store(param.local_storage_key, field_key);

            if (param.clear_store == true) {
                store.clearStore();
            }

            // Mockup data for starting
            let mockup_data = param.load_mockup || [];
            mockup_data.forEach(item => {
                let book = new Model(item);
                store.addItem(book);
            });

            UI.displayItems();
            UI.clearFields();

            return self;
        }

    }

    // Déclaration des méthodes et propriétés publiques
    return {
        init: init,
    };
})();

    window.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM entièrement chargé et analysé");

        let mockup = [
            {
                title: 'La Fabrique De L’homme Nouveau. Travailler, Consommer Et Se Taire ?',
                author: 'Jean-Pierre Durand',
                isbn: '9782356875419',
                price: 20
            },
            {
                title: 'La Dissociété, à la recherche du progrès humain',
                author: 'Jacques Généreux',
                isbn: '9782757822890',
                price:19
            },
        ];

        let constraints = {
            title: {maxlength:"40", required:"required"},
            author: {maxlength:"40", required:"required"},
            isbn: {minlength:"13", maxlength:"13", required:"required"},
            price: {type:"number", min:".01", max:"2000", step:".01", required:"required"},
            shop: {type:"select", options:[{code:'shop01', desc:'shop 1'}, {code:'shop02', desc:'shop 2'}, {code:'shop03', desc:'shop 3'}]}
        };

        let configEntity = {
            locale: 'en_US',
            clear_store: true,
            local_storage_key: 'books',
            title : 'Book manager',
            entityName : 'Book',
            entityKey : 'book',
            fields : ['title', 'author', 'isbn', 'price', 'shop'],
            fieldKey : 'isbn',
            load_mockup: mockup,
            constraints: constraints,
            localize: {
                en_EN: {
                    title: 'Title',
                    author: 'Author',
                    isbn: 'ISBN',
                    price: 'Price',
                    shop: 'Shop'
                },
                fr_FR: {
                    title: 'Titre',
                    author: 'Auteur',
                    isbn: 'ISBN',
                    price: 'Prix',
                    shop: 'Magasin'
                }
            },
            commaSeparator: {
                en: '.',
                en_EN: '.',
                en_US: '.',
                fr: ',',
                fr_FR: ',',
                fr_BE: ','
            },
            numberOfDecs: {
                en: 2,
                en_EN: 2,
                en_US: 2,
                fr: 2,
                fr_FR: 2,
                fr_BE: 2
            },
            monetarySymbol: {
                en: '',
                en_EN: '£',
                en_US: '$',
                fr_FR: '€',
                fr_BE: '€'
            }
        };

        let bookmanager = entityManager.init(configEntity);
    });

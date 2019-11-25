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

class productTitleRule extends peasy.Rule {

    constructor(data, locale = "en") {
        super();
        this.association = "title";
        this.title = String(data).trim();
        this.locale = locale;
        this.literal = 'title';
        if (this.locale == 'fr') {
            this.literal = 'titre';
        }
    }

    _onValidate() {
        if (this[this.association] === "" && productRules[this.association].hasOwnProperty('required')) {
            let msg = '';
            if (this.locale == 'fr') {
                msg = `Le ${this.literal} est obligatoire`;
            } else {
                msg = `The ${this.literal} is mandatory`;
            }
            this._invalidate(msg);
        } else {
            if (productRules[this.association].hasOwnProperty('maxlength') && this[this.association].length > productRules[this.association].maxlength) {
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `La longueur du ${this.literal} ne peut excéder ${productRules[this.association].maxlength} caractères (${this[this.association].length})`;
                } else {
                    msg = `The length of the ${this.literal} cannot exceed ${productRules[this.association].maxlength} characters (${this[this.association].length})`;
                }
                this._invalidate(msg);
            }
        }
        return Promise.resolve();
    }
}

class productAuthorRule extends peasy.Rule {

    constructor(data, locale = "en") {
        super();
        this.association = "author";
        this.author = String(data).trim();
        this.locale = locale;
        this.literal = 'author name';
        if (this.locale == 'fr') {
            this.literal = 'nom de l\'auteur';
        }
    }

    _onValidate() {
        if (this[this.association] === "" && productRules[this.association].hasOwnProperty('required')) {
            let msg = '';
            if (this.locale == 'fr') {
                msg = `Le ${this.literal} est obligatoire`;
            } else {
                msg = `The ${this.literal} is mandatory`;
            }
            this._invalidate(msg);
        } else {
            if (productRules[this.association].hasOwnProperty('maxlength') && this[this.association].length > productRules[this.association].maxlength) {
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `La longueur du ${this.literal} ne peut excéder ${productRules[this.association].maxlength} caractères (${this[this.association].length})`;
                } else {
                    msg = `The length of the ${this.literal} cannot exceed ${productRules[this.association].maxlength} characters (${this[this.association].length})`;
                }
                this._invalidate(msg);
            }
        }
        return Promise.resolve();
    }
}

class productIsbnRule extends peasy.Rule {

    constructor(data, locale="en", proxy=null, mode="insert", id=-Infinity) {
        super();
        this.association = "isbn";
        this.isbn = String(data).trim();
        this.mode = mode;  // "insert" or "update"
        this.id = id;
        this.locale = locale;
        this.literal = 'ISBN code';
        if (this.locale == 'fr') {
            this.literal = 'code ISBN';
        }
        this.proxy = proxy;
    }

    _onValidate() {
        let good_data = true;
        if (this[this.association] === "" && productRules[this.association].hasOwnProperty('required')) {
            good_data = false;
            let msg = '';
            if (this.locale == 'fr') {
                msg = `Le ${this.literal} est obligatoire`;
            } else {
                msg = `The ${this.literal} is mandatory`;
            }
            this._invalidate(msg);
        }
        if (good_data) {
            if (productRules[this.association].hasOwnProperty('maxlength') && this[this.association].length > Number(productRules[this.association].maxlength)) {
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `La longueur du ${this.literal} ne peut excéder ${productRules[this.association].maxlength} caractères (${this[this.association].length})`;
                } else {
                    msg = `The length of the ${this.literal} cannot exceed ${productRules[this.association].maxlength} characters (${this[this.association].length})`;
                }
                this._invalidate(msg);
            }
        }
        if (good_data && (productRules[this.association].hasOwnProperty('unique') && productRules[this.association].unique)) {
            let counter = 0;
            let items = this.proxy.getAll();
            items.then(data => {
                data.forEach((item, key) => {
                    // console.log(item.id, item[this.association], this[this.association]);
                    if (this.mode == 'insert') {
                        if (item[this.association] == this[this.association]) {
                            counter++;
                        }
                    } else {
                        if (item[this.association] == this[this.association] && item.id != this.id) {
                            counter++;
                        }
                    }

                });
            }).then(other => {
                // console.log(counter);
                if (counter > 0) {
                    let msg = '';
                    if (this.locale == 'fr') {
                        msg = `Le ${this.literal} doit impérativement être unique`;
                    } else {
                        msg = `The ${this.literal} must be unique`;
                    }
                    this._invalidate(msg);
                }

            });

        }
        return Promise.resolve();

    }
}

class productPriceRule extends peasy.Rule {

    constructor(data, locale = "en") {
        super();
        this.association = "price";
        this.price = data;
        this.locale = locale;
        this.literal = 'price';
        if (this.locale == 'fr') {
            this.literal = 'prix';
        }
    }

    _onValidate() {
        let good_data = true;
        let price = 0;
        if (isNaN(this.price)) {
            good_data = false;
            let msg = "";
            if (this.locale == 'fr') {
                msg = `Le ${this.literal} n'est pas un nombre valide`;
            } else {
                msg = `The ${this.literal} is not a valid number`;
            }
            this._invalidate(msg);
        } else {
            price = Number(this.price);
        }
        if (good_data) {
            if (productRules[this.association].hasOwnProperty('required') && price == 0) {
                good_data = false;
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `Le ${this.literal} est obligatoire`;
                } else {
                    msg = `The ${this.literal} is mandatory`;
                }
                this._invalidate(msg);
            }
        }
        if (good_data) {
            if (productRules[this.association].hasOwnProperty('min') && price < productRules[this.association].min) {
                good_data = false;
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `Le ${this.literal} ne peut être inférieur à ${productRules[this.association].min}`;
                } else {
                    msg = `The ${this.literal} cannot be less than ${productRules[this.association].min}`;
                }
                this._invalidate(msg);
            }
        }
        if (good_data) {
            if (productRules[this.association].hasOwnProperty('max') && price > productRules[this.association].max) {
                good_data = false;
                let msg = '';
                if (this.locale == 'fr') {
                    msg = `Le ${this.literal} ne peut être supérieur à ${productRules[this.association].max}`;
                } else {
                    msg = `The ${this.literal} cannot be greater than ${productRules[this.association].max}`;
                }
                this._invalidate(msg);
            }
        }
        if (good_data) {
            if (productRules[this.association].hasOwnProperty('decPrecision')) {
                let tmp_price = Number(price.toFixed(productRules[this.association].decPrecision));
                if (price != tmp_price) {
                    good_data = false;
                    let msg = '';
                    if (this.locale == 'fr') {
                        msg = `Le nombre de décimales du ${this.literal} ne peut être supérieur à ${productRules[this.association].decPrecision}`;
                    } else {
                        msg = `The number of decimals for ${this.literal} cannot be greater than ${productRules[this.association].decPrecision}`;
                    }
                    this._invalidate(msg);
                }
            }
        }
        return Promise.resolve();
    }
}

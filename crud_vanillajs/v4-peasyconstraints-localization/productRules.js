class productTitleRule extends peasy.Rule {

  constructor(data) {
    super();
    this.association = "title";
    this.title = String(data).trim();
  }

  _onValidate() {
    if (this.title === "") {
      this._invalidate("Title cannot be blank");
    } else {
      if (this.title.length > 40) {
        this._invalidate("The length of the title cannot exceed 40 characters");
      }
    }
    return Promise.resolve();
  }
}

class productAuthorRule extends peasy.Rule {

  constructor(data) {
    super();
    this.association = "author";
    this.author = String(data).trim();
  }

  _onValidate() {
    if (this.author === "") {
      this._invalidate("Author name cannot be blank");
    } else {
      if (this.author.length > 40) {
        this._invalidate("The length of the author name cannot exceed 40 characters");
      }
    }
    return Promise.resolve();
  }
}

class productIsbnRule extends peasy.Rule {

  constructor(data) {
    super();
    this.association = "isbn";
    this.isbn = String(data).trim();
  }

  _onValidate() {
    if (this.isbn === "") {
      this._invalidate("ISBN cannot be blank");
    } else {
      if (this.isbn.length != 13) {
        this._invalidate("the length of the ISBN must be 13 characters");
      }
    }
    return Promise.resolve();
  }
}

class productPriceRule extends peasy.Rule {

  constructor(data) {
    super();
    this.association = "price";
    this.price = data;
  }

  _onValidate() {
    if (this.price != parseFloat(this.price)) {
      this._invalidate("The price is not a valid number");
    } else {
      this.price = Number(this.price);
      if (this.price == 0) {
        this._invalidate("the price is required");
      } else {
        if (this.price < 0) {
          this._invalidate("the price cannot be negative");
        } else {
          if (this.price > 2000) {
            this._invalidate("the price cannot exceed 2000");
          }

        }
      }
    }
    return Promise.resolve();
  }
}

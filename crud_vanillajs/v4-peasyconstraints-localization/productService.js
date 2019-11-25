class productService extends peasy.BusinessService {

    constructor(dataProxy, locale = "en") {
        super(dataProxy);
        this.locale = locale;
        this.proxy = dataProxy;
    }

    _getRulesForInsertCommand(data, context) {
        return Promise.resolve([
            new productTitleRule(data.title, this.locale),
            new productAuthorRule(data.author, this.locale),
            new productIsbnRule(data.isbn, this.locale, this.proxy, 'insert'),
            new productPriceRule(data.price, this.locale)
        ]);
    }

    _getRulesForUpdateCommand(data, context) {
        return Promise.resolve([
            new productTitleRule(data.title, this.locale),
            new productAuthorRule(data.author, this.locale),
            new productIsbnRule(data.isbn, this.locale, this.proxy, 'update', data.id),
            new productPriceRule(data.price, this.locale)
        ]);
    }
}

class productService extends peasy.BusinessService {

  constructor(dataProxy) {
   super(dataProxy);
  }

  _getRulesForInsertCommand(data, context) {
    return Promise.resolve([
      new productTitleRule(data.title),
      new productAuthorRule(data.author),
      new productIsbnRule(data.isbn),
      new productPriceRule(data.price)
    ]);
  }

  _getRulesForUpdateCommand(data, context) {
    return Promise.resolve([
      new productTitleRule(data.title),
      new productAuthorRule(data.author),
      new productIsbnRule(data.isbn),
      new productPriceRule(data.price)
    ]);
  }
}

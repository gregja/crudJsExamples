class dataProxy {

  constructor(key='id') {
    this.data = [];
    this.key = key;
  }

  getById(key) {
    var item = this.findBy(key);
    return Promise.resolve(item);
  }

  getAll() {
    return Promise.resolve(this.data);
  }

  insert(data) {
    data[this.key] = this.data.length + 1;
    var newitem = Object.assign({}, data);
    this.data.push(newitem);
    return Promise.resolve(newitem);
  }

  update(data) {
    var item = this.findBy(data[this.key]);
    Object.assign(item, data);
    return Promise.resolve(item);
  }

  destroy(key) {
    var item = this.findBy(key);
    var index = this.data.indexOf(item);
    this.data.splice(index, 1);
    return Promise.resolve();
  }

  findBy(key) {
    var item = this.data.filter((p => {
      return p[this.key] === key;
    }))[0];
    return Promise.resolve(item);
  }

}

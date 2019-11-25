class dataProxy {

    constructor(key = "id") {
        this._data = [];
        this.key = key;
    }

    setKey(key) {
        this.key = key;
    }

    getKey() {
        return this.key;
    }

    getById(key) {
        var item = this.findBy(key);
        return Promise.resolve(item);
    }

    getAll() {
        return Promise.resolve(this._data);
    }

    import(datas) {
        datas.forEach(item => {
            this._data.push(item);
        });
        return Promise.resolve(datas.length);
    }

    insert(data) {
        data[this.key] = this._data.length + 1;
        var newitem = Object.assign({}, data);
        this._data.push(newitem);
        return Promise.resolve(data);
    }

    update(data) {
        var item = this.findBy(data[this.key]);
        Object.assign(item, data);
        return Promise.resolve(data);
    }

    destroy(key) {
        var item = this.findBy(key);
        var index = this._data.indexOf(item);
        this._data.splice(index, 1);
        return Promise.resolve();
    }

    findBy(key) {
        var item = this._data.filter((p => {
            return p[this.key] === key;
        }))[0];
        return Promise.resolve(item);
    }
}

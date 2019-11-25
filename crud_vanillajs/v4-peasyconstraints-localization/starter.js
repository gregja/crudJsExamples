
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");

    let mockup = [
        {
            id: 1,
            title: 'La Fabrique De L’homme Nouveau. Travailler, Consommer Et Se Taire ?',
            author: 'Jean-Pierre Durand',
            isbn: '9782356875419',
            price: 20
        },
        {
            id: 2,
            title: 'La Dissociété, à la recherche du progrès humain',
            author: 'Jacques Généreux',
            isbn: '9782757822890',
            price:19
        },
    ];

    // TODO : uncomment the lines below, to see how controls work, with and without HTML5 validation
    //        because PeasyJs check the values in all cases
    let constraints = {
    //    title: {maxlength:"100", required:"required"},
    //    author: {maxlength:"40", required:"required"},
    //    isbn: {minlength:"13", maxlength:"13", required:"required"},
    //    price: {type:"number", min:".01", max:"20000", step:".01", required:"required"},
        shop: {type:"select", options:[{code:'shop01', desc:'shop 1'}, {code:'shop02', desc:'shop 2'}, {code:'shop03', desc:'shop 3'}]}
    };

    let configEntity = {
        locale: 'en_US',
        locale_peasyjs: 'en',
        clear_store: true,
        local_storage_key: 'books',
        title : 'Book manager',
        entityName : 'Book',
        entityKey : 'book',
        fields : ['title', 'author', 'isbn', 'price', 'shop'],
        hiddenFields: ['id'],
        fieldKey : 'id',
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

    var dataProxy = new productDataProxy();
    var prodService = new productService(dataProxy, configEntity.locale_peasyjs);

    let bookmanager = entityManager.init(configEntity, dataProxy, prodService);
});

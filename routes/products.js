const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { default: Ajv } = require('ajv');

const ajv = new Ajv();

const productSchema = require('./schema/product.schema.json');
const productValidator = ajv.compile(productSchema);

const productMw = function(req, res, next) {
    const productResult = productValidator(req.body);
    if(productResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}

const products = [
    {
    "id": uuidv4(),
    "title": "Ice skates",
    "description": "Used but good condition ice skates size 36",
    "userCategory": "winter sport",
    "location": "Oulu",
    "image1": null,
    "image2": null,
    "image3": null,
    "image4": null,
    "askingPrice": 5,
    "dateOfPosting": "2022-01-01",
    "deliveryType": 2, //2 for shipping
    "sellersName": "Pekka",
    "sellersContact": 123456
}, 
{
    "id": uuidv4(),
    "title": "Table and 4 chairs",
    "description": "Round table and 4 chairs, like new",
    "userCategory": "home",
    "location": "Kemi",
    "image1": null,
    "image2": null,
    "image3": null,
    "image4": null,
    "askingPrice": 55,
    "dateOfPosting": "2022-02-04",
    "deliveryType": 1, //1 for pickup
    "sellersName": "Milla",
    "sellersContact": 7654321
},
{
    "id": uuidv4(),
    "title": "Electric guitar",
    "description": "Pink semi-acoustic electric guitar, very good condition",
    "userCategory": "music",
    "location": "Kiiminki",
    "image1": null,
    "image2": null,
    "image3": null,
    "image4": null,
    "askingPrice": 115,
    "dateOfPosting": "2021-12-24",
    "deliveryType": 2, //2 shipping
    "sellersName": "Ville",
    "sellersContact": 5672134
} ];

router.get('/', (req, res) => {
    res.json(products);
})

router.get('/:id', (req, res) => {
    let foundIndex = products.findIndex(t => t.id === req.params.id);
    if (foundIndex === -1) {
        res.sendStatus(404);
        return;
    } else {
        res.json(products[foundIndex]);
    } })

router.get('/category/:userCategory', (req, res) => {
    console.log(req.params.userCategory)
    const result = []
    for(var i in products){
        if(products[i].userCategory == req.params.userCategory)
        result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.get('/location/:location', (req, res) => {
    console.log(req.params.location)
    const result = []
    for(var i in products){
        if(products[i].location == req.params.location)
        result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.get('/posting/:dateOfPosting', (req, res) => {
    console.log(req.params.dateOfPosting)
    const result = []
    for(var i in products){
        if(products[i].dateOfPosting == req.params.dateOfPosting)
        result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.delete('/:id', (req, res) =>{
        let foundIndex = -1;
        for(let i = 0; i < products.length; i++){
            if(products[i].id === req.params.id) {
                foundIndex = i;
                break;
            }
        }
    
        if(foundIndex === -1){
            res.sendStatus(404);
            return;
        }else{
             products.splice(foundIndex, 1);
             res.sendStatus(202);
        }
    })

router.post('/', productMw, (req, res) =>{

    products.push({
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        userCategory: req.body.userCategory,
        location: req.body.location,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        askingPrice: req.body.askingPrice,
        dateOfPosting: req.body.dateOfPosting,
        deliveryType: req.body.deliveryType,
        sellersName: req.body.sellersName,
        sellersContact: req.body.sellersContact
    });
    res.sendStatus(201);
})


router.put('/:id', (req, res) => {
    let foundProduct = products.find(t => t.id === req.params.id);
    if(foundProduct){
        foundProduct.title = req.body.title;
        foundProduct.description = req.body.description;
        foundProduct.userCategory = req.body.userCategory;
        foundProduct.location = req.body.location;
        foundProduct.askingPrice = req.body.askingPrice;
        foundProduct.dateOfPosting = req.body.dateOfPosting;
        foundProduct.deliveryType = req.body.deliveryType;
        foundProduct.sellersName = req.body.sellersName;
        foundProduct.sellersContact = req.body.sellersContact;
        res.sendStatus(200);
    }
    else{
        res.sendStatus(404);
    }
})

module.exports = router
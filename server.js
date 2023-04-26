var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1/swag-shop', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
var portMongoDB = 27017;
var port = 4000;

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

const router = express.Router();
app.use("/", router);

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: false
}));



app.listen(port, function () {
    console.log("Swag Shop API running on port " + port);
});

//async function getItems() {
//    const products = await Product.find({});
//    return products;
//}
async function getItems(items) {
    const result = await items.find({});
    return result;
}


async function fetchOneItem(items, title) {
    const fetchResult = await items.find({
        "title": title
    });
    return fetchResult;
}

app.get('/product', function (req, response) {
    getItems(Product).then(function (FoundProducts) {
        console.log(FoundProducts);
        response.send(FoundProducts);
    })
});

app.get('/wishlist', function (req, response) {
    getItems(WishList).then(function (FoundWishLists) {
        console.log(FoundWishLists);
        response.send(FoundWishLists);
    })
});



app.put('/wishlist/product/add', function(request, response) {
    fetchOneItem(Product, request.body.productId).then(function (FoundItem) {
        WishList.update({_id: request.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishlist) {
            if (err) {
                response.status(500).send({error: "Could not add item to Wishlist"});
            }
            else {
                response.send(wishlist);
            }
        });
        
        console.log(FoundItem);
        response.send(FoundItem);
    })
});




app.post('/wishlist', function(request, response) {
    var wishlist = new WishList();
    wishlist.title = request.body.title;

    wishlist.save()
        .then(item => {
            response.send(item);
            console.log(item);
        })
        .catch(err => {
            console.log(err);
        })

})

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;

    product.save()
        .then(item => {
            response.send(product);
            console.log(product);
        })
        .catch(err => {
            console.log(err);
        })

});

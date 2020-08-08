const express = require("express");
const mongodb = require("mongodb");
const uri = process.env.DATABASE_URI

const app = express();
app.use(express.json());

app.get("/search", function (request, response) {
    const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('sample-airbnb')
    const collection = db.collection('listingsAndReviews');
    const { name } = request.query;
    const { summary } = request.query;
    const searchObject = { $or: [{ name: name }, { summary: summary }] };

    collection.find(searchObject).toArray(function(error, result) {
        if (error) {
            response.status(500).send(error)
        } else {
            response.send(result)
        }
      })
});
})

app.get("/listings/:price", function (request, response) {
    const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('sample-airbnb')
    const collection = db.collection('listingsAndReviews');

    let price = request.params.price
    
    const searchObject = { price: price };
    collection.find(searchObject).toArray(function (error, result) {
      const searchPrice = result.filter(data => data.price == Number(price))

      if (error) {
          response.status(500).send(error)
      }
      if (searchPrice.length > 0) {
        response.status(200).send(searchPrice);
      } else {
        response.status(404).send("Listing not found, please specify another price!");
      }
      client.close();
    });
});
})


app.listen(3000);
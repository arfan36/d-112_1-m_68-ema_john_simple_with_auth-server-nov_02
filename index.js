const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterarfan36.opuzllc.mongodb.net/?retryWrites=true&w=majority`;
// console.log('uri :>> ', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('emaJohn').collection('products');

        // Read (R) all
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log('page, size :>> ', page, size);
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });
        });

        // Create (C) : 
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id));
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

    }
    finally {

    }
}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

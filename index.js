const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvzj8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Server running...");
});





const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// yN9rH66HHPHyLYod
// nodeJsProject

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // all code here

        const database = client.db("allProducts");
        const productCollection = database.collection("products");

        // get products api 
        app.get('/allproducts', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });




        // add Product

        app.post('/allproducts', async (req, res) => {
            try {
                const newProduct = req.body; // Access the data sent by client
                console.log('Received product:', newProduct);

                // Respond back to client
                res.send({ message: 'Product received successfully', product: newProduct });

                const result = await productCollection.insertOne(newProduct);
                res.send(result);





            } catch (error) {
                console.error('Error receiving product:', error);
                res.send({ message: 'Error receiving product' });
            }
        });




















        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

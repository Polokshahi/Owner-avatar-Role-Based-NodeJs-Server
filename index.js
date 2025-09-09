const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpvzj8u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1 } });

// Main function
async function run() {
    try {

        app.get('/', (req, res) => {
            res.send('server is runing')
        })
        await client.connect();
        console.log("MongoDB connected!");

        // Collections
        const productCollection = client.db("allProducts").collection("products");
        const usersCollection = client.db("allProducts").collection("users");
        const addtoCart = client.db("allProducts").collection("AddtoCartData")


        // Get all products
        app.get("/allproducts", async (req, res) => {
            const products = await productCollection.find().toArray();
            res.send(products);
        });

        // Add a product
        app.post("/allproducts", async (req, res) => {
            try {
                const newProduct = req.body;
                const result = await productCollection.insertOne(newProduct);
                res.send(result);
            } catch (err) {
                console.error("Add product error:", err);
                res.status(500).send({ message: "Failed to add product" });
            }
        });

        // handle add to cart


        app.post("/addtoCart", async (req, res) => {
            try {
                const { productId, name, price, image, userEmail } = req.body;

                // 1. Validate required fields
                if (!productId || !userEmail) {
                    return res.status(400).json({ success: false, message: "Missing productId or userEmail" });
                }

                // 2. Check if this product is already in the user's cart
                const exists = await addtoCart.findOne({ productId, userEmail });
                if (exists) {
                    return res.json({ success: false, message: "Product already in cart" });
                }

                // 3. Insert new item
                const result = await addtoCart.insertOne({
                    productId,
                    name,
                    price,
                    image,
                    userEmail,
                   
                });

                res.json({ success: true, insertedId: result.insertedId });
                console.log("Cart Item Added:", { productId, userEmail });
            } catch (error) {
                console.error("Error inserting cart item:", error);
                res.status(500).json({ success: false, message: "Server error" });
            }
        });


        app.get("/addtoCart", async (req, res) => {
            try {
                const result = await addtoCart.find().toArray();
                res.send(result);
            } catch (err) {
                res.send(err)
            }
        })


        // app.get("/addtoCart", async(req, res) =>{
        //     const email = req.params.email;
        //     const query = {email: email}
        //     const result = addtoCart.find(query).toArray();
        //     res.send(result);
        // })





        app.delete("/addtoCart/:id", async(req, res) =>{
            const id = req.params.id;
            const deleteQueryById = {productId : (id)}
            const result = await addtoCart.deleteOne(deleteQueryById);
            res.send(result);
            console.log(id);

        })












        // ===== Users APIs =====
        // Add new user with default role
        app.post("/users", async (req, res) => {
            const user = req.body;
            const existing = await usersCollection.findOne({ email: user.email });
            if (existing) return res.send(existing);

            user.role = "user"; // default role
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });



        // Get all users
        app.get("/users", async (req, res) => {
            try {
                const users = await usersCollection.find().toArray();
                res.send(users);
            } catch (err) {
                console.error("Get all users error:", err);
                res.status(500).send({ message: "Failed to get users" });
            }
        });



        // Get user by email (to check role)
        app.get("/users/:email", async (req, res) => {
            const user = await usersCollection.findOne({ email: req.params.email });
            res.send(user);
        });



        // product deleted by admin 

        app.delete('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

















    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);

// Start server

app.listen(port, () => console.log(`Server running on port ${port}`));

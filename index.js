const express = require('express');
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()


//Middleware add 
app.use(cors())
app.use(express.json())

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33tct4k.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeeCollection = client.db("coffeeDB").collection("coffee")
        const userCollection = client.db("userDB").collection("users")

        app.get("/coffees", async (req, res) =>{
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/users", async (req, res) =>{
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.get("/coffees/:id", async (req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })
        app.post("/coffees", async (req, res) =>{
            coffee = req.body
            console.log(coffee)
            const result = await coffeeCollection.insertOne(coffee)
            res.send(result)
        })

        app.post("/users", async(req, res) =>{
            const user = req.body
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.put("/coffees/:id", async (req, res) => {
            const id = req.params.id
            const coffee = req.body
            const filter= {
                _id: new ObjectId(id)
            }
            const options = {upsert: true}
            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    details: coffee.details,
                    photo: coffee.photo,
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options)
            res.send(result)
        })

        app.patch("/users", async (req, res) =>{
            const user = req.body
            const filter = {email: user.email}
            const options = {
                upsert: true
            }

            const updateUser = {
                $set: {
                    lastSignInTime: user.lastSignInTime
                }
            }

            const result = await userCollection.updateOne(filter, updateUser, options)
            res.send(result)
        })

        app.delete("/coffees/:id", async (req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })


        app.delete("/users/:id", async(req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) =>{
    res.send("Coffee Store Server Running")
})

app.listen(port, ()=>{
    console.log(`Coffee Store Server Running Port is ${port}`);
})
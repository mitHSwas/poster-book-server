const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkdpmwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db("posterBook").collection("posts");
        const commentCollection = client.db("posterBook").collection("comments");
        const aboutCollection = client.db("posterBook").collection("about");
        app.get("/posts", async (req, res) => {
            const query = {}
            const result = await postCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/postDetails/:id', async (req, res) => {
            const postId = req.params.id;
            const query = { _id: ObjectId(postId) };
            const result = await postCollection.findOne(query);
            res.send(result);
        })
        app.get('/comments/:id', async (req, res) => {
            const commentId = req.params.id;
            const query = { postId: commentId };
            const result = await commentCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        })
        app.get('/about', async (req, res) => {
            const query = {};
            const result = await aboutCollection.findOne(query);
            res.send(result);
        })

        app.post("/posts", async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })
        app.post("/comments", async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })

        app.patch('/about', async (req, res) => {
            const query = req.body._id;
            const name = req.body.name;
            const email = req.body.email;
            const phone = req.body.phone;
            const university = req.body.university;
            const address = req.body.address;
            const filter = { _id: ObjectId(query) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: name,
                    email: email,
                    phone: phone,
                    university: university,
                    address: address,
                },
            };
            const result = await aboutCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Testing app is listening on port ${port}`)
})
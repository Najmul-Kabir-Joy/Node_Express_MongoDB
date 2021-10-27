const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());

// mydbuser1
// Zi1ed8YR67NEtfEs

const uri = "mongodb+srv://mydbuser1:Zi1ed8YR67NEtfEs@cluster0.a85bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const db = client.db('test');
        const usersCollection = db.collection('users');
        //get API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        //get API for user update
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('requesting info for', id);
            res.send(user);

        })

        //post api 
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result)
        });

        // UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('updating', req)
            res.json(result);
        })


        //DELTE API

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleting', result);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)





//old system
/* client.connect(err => {
    const collection = client.db("test").collection("users");
    // perform actions on the collection object
    console.log('hitting the db');
    const user = { name: 'Kabir', email: 'kabir@mail.com', phone: '0167972311' };
    collection.insertOne(user)
        .then(() => {
            console.log('insert done');
        })
    // client.close();
}); */

// latestSystem using async await

// async function run() {
//     try {
//         await client.connect();
//         const database = client.db("test");
//         const usersCollection = database.collection("users");
//         // create a document to insert
//         const doc = {
//             name: "Chaiya chaiya",
//             email: "jopaji@mail.com",
//         }
//         const result = await usersCollection.insertOne(doc);
//         console.log(`A document was inserted with the _id: ${result.insertedId}`);
//     } finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);


/* async function run() {
    try {
        await client.connect();
        const database = client.db('test');
        const usersCollection = database.collection('users');
        const doc = {
            name: "laziz bhai",
            email: 'laziz@mail.com'
        }
        const result = await usersCollection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);

        console.log(result);
    }
    finally {
        await client.close();
    }

} */
// run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running on my CRUD server')
});

app.listen(port, () => {
    console.log('Listenning on port', port);
})
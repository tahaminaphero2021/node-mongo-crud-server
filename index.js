const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
//OBJ ID DECLARE FOR THE DELETE
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//user:mydbuser1
//password:iM7SvDR6w0te6lSI
const uri = "mongodb+srv://mydbuser1:iM7SvDR6w0te6lSI@cluster0.bm6uk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//apply async await [stage-2] data set mongodb

async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");
      // // create a document to insert
      // const doc = {
      //   name: "Special one",
      //  email: "special@hotmail.com",
      // }
      // const result = await usersCollection.insertOne(doc);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
      
      //GET API
      app.get('/users', async (req, res) => {
        const cursor = usersCollection.find({});
        //connection user to the cursor
        const users = await cursor.toArray();
        res.send(users);
      });
      //update user id detail
      app.get('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id) };
        const user = await usersCollection.findOne(query);
        console.log('load user with id: ',id);
        res.send(user)
        // res.send('getting soon')
      })
      
      
      //POST API:stage-3
      app.post('/users', async (req, res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
       console.log('got new user', req.body); 
       console.log('added user', result);
        
        res.json(result);
        // res.send('hit my post');
      });
      
      //UPDATE API
      app.put('/users/:id', async(req, res) => {
        const id = req.params.id;
        const updateUser = req.body;
        const filter = {_id: ObjectId(id) };
        const options= {upsert: true };
        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email
          },
        };
        const result= await usersCollection.updateOne(filter, updateDoc, options)
        console.log('update user', req)
        // console.log('update user', id)
        res.json(result);
        // res.send('updating not dating');
      })

      //DELETE API
      app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query ={_id: ObjectId(id) };
        const result = await usersCollection.deleteOne(query);

        console.log('Deleting user an id', result);
        // console.log('Deleting user an id', id);
        res.json(result);
        // res.json(1);
      })

   
    } 
    finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
//stage-1[data set mongodb]
// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   // perform actions on the collection object
//   console.log("hitting databassssssssssssssssse");
//   const user ={name: 'gais uddin', email: 'giassew@gmail.com', phone: '0156987000'};
//   collection.insertOne(user)
//   .then(() => {
//       console.log("inside success");
//   })
// //   client.close();

// });

app.get('/', (req, res) => {
    res.send("Running my crud server");
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})
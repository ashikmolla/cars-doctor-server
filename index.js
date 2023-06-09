
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, serialize } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PROT || 2000

// middleawer
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hun2r3q.mongodb.net/?retryWrites=true&w=majority`;

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

    const servicesCollection = client.db('carDoctor').collection('services');
    const bookingCollection= client.db('carDoctor').collection('bookings') 


//  multipol data cline send 
  app.get('/services', async(req, res)=>{
    const cursor=servicesCollection.find();
    const result=await cursor.toArray();
    res.send(result);
  });

  // singele data clint site send
  app.get('/services/:id', async(req, res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};
   
   const options={
    projection:{ title: 1, price: 1, services_id: 1, img:1 }
   };
   
    const result=await servicesCollection.findOne(query, options);
    res.send(result)
  })

  ////  boking 
 
  //// server theke clint side data paowar niom
  app.get('/bookings', async(req, res)=>{

    console.log(req.query.email)
    let query={};
    if(req.query?.email){
      query ={email: req.query.email}
    }

    const result= await bookingCollection.find().toArray();
    res.send(result)
  })

  // cline server theke data clate korci akhane kinto 
  app.post('/bookings', async(req, res)=>{
    const booking=req.body;
    console.log(booking);
    const result= await bookingCollection.insertOne(booking);
    res.send(result)
   
  }) 



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.get('/', (req, res) => {
  res.send('cars Doctors Runninge ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
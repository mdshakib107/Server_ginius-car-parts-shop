const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5001;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


//dbConnect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ns2tb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services);

        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            // const options = {
            //     projection: { _id: 0 }
            // };
            const service = await serviceCollection.findOne(quary);
            res.send(service);
        });

        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Ginus Car Service Server Is Running");
});

app.listen(port, () => {
    console.log("Port Is Listiening From ", port)
})
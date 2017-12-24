const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Error connecting to the database server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    // db.collection('todos').find({
    //     // completed: false
    //     _id: new ObjectID('5a401698d8007b2584a0000c')
    // }).toArray()
    //     .then((docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (error) => {
    //         console.log('Unable to fetch todos', error)
    //     });

    db.collection('todos').find().count()
        .then((count) => {
            console.log(`${ count } todos found.`)
        }, (error) => {
            console.log('Unable to fetch todos', error)
        });

    db.collection('users').find({
        username: 'Lasagna Larry'
    }).toArray().then((docs) => {
        console.log(docs);
    }, (error) => {
        console.log('Unable to fetch users', error)
    })

    client.close();
});
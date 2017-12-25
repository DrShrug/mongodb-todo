const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Error connecting to the database server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    
    // db.collection('todos').findOneAndUpdate({
    //     _id: new ObjectID('5a4038c087b65ac967c4c3e9')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('users').findOneAndUpdate({
        _id: new ObjectID('5a402062a6489d1d248c1e21')
    }, {
        $set: {
            username: 'Mr. Dean Dingus'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    client.close();
});
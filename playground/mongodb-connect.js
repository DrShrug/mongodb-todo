// const MongoClient = require('mongodb').MongoClient;
// Object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Error connecting to the database server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // db.collection('todos').insertOne({
    //     text: 'Do this',
    //     completed: false
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops), undefined, 2);
    // });

    db.collection('users').insertOne({
        username: 'Lasagna Larry',
        age: 46,
        location: 'Boston'
    }, (error, result) => {
        if (error) {
            return console.log('Unable to add new user', err);
        }

        console.log(JSON.stringify(result.ops), undefined, 2);
    });

    client.close();
});
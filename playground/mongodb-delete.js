const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Error connecting to the database server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    
    // Deletes all matches
    // db.collection('todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result)
    // }, (error) => {
    //     console.log('Error deleting todos')
    // });

    // Delete first match, regardless of number of matches
    // db.collection('todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result)
    // });

    // Find and Delete
    // db.collection('todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    // Back to back deletes
    db.collection('users').deleteMany({
        username: 'Lasagna Larry'
    }).then((result) => {
        console.log(result)
    });

    db.collection('users').findOneAndDelete({
            username: 'Bobby Larry'
        }).then((result) => {
            console.log(result)
        })
    client.close();
});
// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.end("Hello first project!");
    res.send({ api: 'up and running...' })
})

server.get('/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200)
            .json(users);
        })
        .catch(error => {
            console.log('error on GET /users', error);
            res
                .status(500)
                .json({ errorMessage: "error getting list of users from database" });
        })
})

const port = 5000
server.listen(port, () =>
    console.log(`\n ** API running on post ${port} ** \n`)
);
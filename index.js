// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.end("Hello first project!");
    res.send({ api: 'up and running...' })
})

server.post('/users', (req, res) => {
    const userData = req.body;

    db.insert(userData)
        .then(user => {
            res.status(201)
            .json(user)
        })
        .catch(error => {
            console.log('error on POST /users', error);
            res
                .status(500)
                .json({ errorMessage: "error adding the hub" });
        })
})

server.get('/users', (req, res) => {
    db.find()
        .then(user => {
            res.status(200)
            .json(user);
        })
        .catch(error => {
            console.log('error on GET /users', error);
            res
                .status(500)
                .json({ errorMessage: "error getting list of users from database" });
        })
})

server.get('/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            res.status(200)
            .json(user);
        })
        .catch(error => {
            console.log('error on GET by id /users', error);
            res
                .status(500)
                .json({ errorMessage: "error getting user from database" });
        })
})

server.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(removed => {
            if(removed) {
                res.status(200)
                .json({ message: "user removed successfully" })
            } else {
                res.status(404)
                .json({ message: "user not found" })
            }
        })
        .catch(error => {
            console.log('error on DELETE /users/:id', error);
            res
                .status(500)
                .json({ errorMessage: "error removing the user" })
        })
})

// server.put('/user/:id', (req, res) => {
//     const id = req.params.id;

//     db.update(id)
//         .then(user => {
//             res.status(201)
//             .json(user)
//         })
//         .catch(error => {
//             console.log('error on PUT /users/:id', error);
//             res
//                 .status(500)
//                 .json({ errorMessage: "error updating the user" });
//         })
// })

server.put(`/api/users/:id`, (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if(!name && !bio){
        res
            .status(400)
            .json({error:"Error."})
    }
    db.update(id, { name, bio })
        .then(updated => {
            if(updated) {
                db.findById(id)
                    .then(user => res
                        .status(200)
                        .json(user))
                    .catch(error => {
                        console.log(error);
                        res
                            .status(500)
                            .json({error: "error updating the user"})
                    })
            } else {
                res
                    .status(404)
                    .json({message:"user does not exist"})
            }
        })
});

const port = 5000
server.listen(port, () =>
    console.log(`\n ** API running on post ${port} ** \n`)
);
const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).send({ message: "Hey boi it's workin yo" });
});

server.get("/accounts", (req, res) => {
    let accounts = db("accounts")
        .orderBy("id", "asc")
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ message: "Error getting accounts" });
        });
});

server.get("/accounts/:id", (req, res) => {
    let id = req.params.id;
    let accounts = db("accounts")
        .orderBy("id", "asc")
        .where({ id })
        .then(account => {
            res.status(200).json(account);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ message: "Error getting the account" });
        });
});

server.post("/accounts/", (req, res) => {
    if (req.body.name && req.body.budget) {
        let newAccount = {
            name: req.body.name,
            budget: req.body.budget
        };

        let accounts = db("accounts")
            .insert(newAccount)
            .then(([id]) => {
                res.status(200).send({ id: id });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ message: "Error adding the account" });
            });
    } else {
        res.status(400).send({ message: "Please include a name and budget" });
    }
});

server.put("/accounts/:id", (req, res) => {
    if (req.body.name || req.body.budget) {
        let changes = {
            ...req.body
        };

        let id = req.params.id;

        let accounts = db("accounts")
            .where({ id })
            .update(changes, "*")
            .then(account => {
                res.status(200).json(account);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: "Error updating the account" });
            });
    } else {
        res.status(400).send({ message: "Please include a name or budget" });
    }
});

server.delete("/accounts/:id", (req,res) => {
    let id = req.params.id;
    let accounts = db("accounts")
        .where({ id })
        .del()
        .then((accounts) => {
            res.status(200).send({message: "Account successfully deleted"})
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({message: "Error deleting the account"})
        })
})

module.exports = server;

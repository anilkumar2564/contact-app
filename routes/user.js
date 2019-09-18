const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

Router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ name: req.body.name }).
        then(user => {
            if (!user) {
                console.log("this fails");
                return res.status(404).json({ "error": true, "message": "User Does not Exist" });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);   //if user exist then comparing the encrypted password 
        }).
        then(result => {
            if (!result) {
                return res.status(404).json({ message: "failed" });
            }
            else {
                const token = jwt.sign({ name: fetchedUser.name },         //sigining the token  for token authentication
                    "the_secret",
                    { expiresIn: "1h" });
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    name: fetchedUser.name
                })
            }
        });
});

Router.post("/register", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)   //encrypting the password before storing
        .then((hash) => {
            const user = new User({
                name: req.body.name,
                password: hash
            });
            user.save().then(data => {
                return res.status(201).json({ "message": " User Registered" });
            }).catch(err => {
                return res.status(201).json({ "error": true, "message":err.message });
            })
        })
})




module.exports = Router; 
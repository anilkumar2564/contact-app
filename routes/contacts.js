const express = require('express');
const Router = express.Router();
const Contact = require('../models/contacts');
const checkAuth = require('../middleware/check-auth');

//Route for creating Routes 
//Data is coming in post method 
Router.post("/create", checkAuth, (req, res, next) => {

  const loggedInUser = req.userData.name;      //getting name of loggedin user
  const contact = new Contact({
    loggedUser: loggedInUser,                //mapping loggedin user name in contacts database 
    name: req.body.name,
    number: req.body.number
  });
  contact.save().then(data => {
    res.status(200).json({ message: "Contact saved" });
  }).catch(err => {
    console.log(err.message);
    return res.status(409).json({ error: err });;
  })

})
//Route to Update the Contact information for particular logged in User
Router.put("/edit/:id", checkAuth, (req, res, next) => {
  const loggedInUser = req.userData.name;  //fetching logged-in user from request data which is added by middleware checkauth
  const contact = new Contact({
    _id: req.params.id,
    loggedUser: loggedInUser,
    name: req.body.name,
    number: req.body.number
  });

  Contact.updateOne({ _id: req.params.id }, contact).then(data => {
    res.status(200).json({ message: "Yeyy Contact Updated" });
  }).catch(err => {
    return res.status(400).json({ "error": true, "message": "contact does not exist in the List" });
  })

})
//Route for Deleting Record for particular Contact
Router.delete("/delete/:id", checkAuth, (req, res, next) => {
  Contact.deleteOne({ _id: req.params.id }).then(data => {
    res.status(200).json({ "message": " Yeyyyy Contact Deleted" });
  }).catch(err => {
    return res.status(404).json({ "error": true, "message": "contact does not exist in the List" });
  })
})
// Route for fetching all contacts with pagination
//pageNo And size are query parameters
Router.get("", checkAuth, (req, res, next) => {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {};
  //if page number is less than zero or equal to zero then show an error
  if (pageNo < 0 || pageNo === 0) {
    response = { "error": true, "message": "invalid page number,start with 1" };
    return res.json(response)
  }
  //skip the records according to the entered page number in query parameter
  query.skip = size * (pageNo - 1);
  query.limit = size;
  Contact.count({}, (err, pageCount) => {
    if (err) {
      res.status(400).json({ "error": true, "message": "Error fetching data" })
    }
    Contact.find({}, { name: 1, number: 1 }, query, (err, data) => {
      if (err) {
        res.status(400).json({ "error": true, "message": "Error fetching data" })
      }
      else {
        var totalPages = Math.ceil(pageCount / size);
      }
      res.status(200).json({ "error": false, "message": data, "pages": totalPages });

    })
  })
})

module.exports = Router;
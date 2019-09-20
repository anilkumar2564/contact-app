const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contacts");
const mongoose=require('mongoose');
// const userRoutes = require("./routes/user");
const http = require("http");
const User=require('./models/user');
const Contact=require('./models/contacts');


const app = express();
mongoose
  .connect('mongodb://localhost:27017/contact-app')
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

const port=process.env.PORT||3000;
app.set( 'port', port );


const server = http.createServer(app);
server.listen(port,()=>{
  console.log("listening");
});


module.exports=app;

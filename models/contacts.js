const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  loggedUser: { type: String },
  name: { type: String, required: true },
  number: { type: String, required: true }
});
module.exports = mongoose.model("Contact", contactSchema);
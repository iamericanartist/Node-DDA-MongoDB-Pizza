"use strict"

const mongoose = require("mongoose")

const HTML5_EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

module.exports = mongoose.model("Order", {
  name: { type: String, required: [true, "Please enter a name!"]},        //custom messages
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    match: [HTML5_EMAIL_VALIDATION, "Please enter valid email address"]
  },
  phone: { type: String, required: true},
  size:  { type: Number, required: true},
  toppings:  { type: [String], default: ["cheese"]},
})

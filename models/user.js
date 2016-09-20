"use strict"

const mongoose = require("mongoose")

const HTML5_EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

module.exports = mongoose.model("User", {
  email: {
    type: String,
    lowercase: true,
    required: true,
    match: [HTML5_EMAIL_VALIDATION, "Please enter valid email address"],
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  }
})

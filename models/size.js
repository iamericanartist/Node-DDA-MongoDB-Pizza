"use strict"

const mongoose = require('mongoose'); // "./"" if in same folder,  "../"" if in outer

module.exports = mongoose.model("Size", {
  name: String,
  inches: Number,
})

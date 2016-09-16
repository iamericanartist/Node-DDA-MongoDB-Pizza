'use strict'

const { connect, disconnect } = require('./database')


//JSON usage
const sizes = require('./sizes')
const toppings = require('./toppings')

connect()
  .then(() => Size.remove({}))
  .then(() => Size.insertMany(sizes))
  .then(() => Topping.remove({}))
  .then(() => Topping.insertMany(toppings))
  .then(disconnect)
  .catch(console.error)


///////////////////////////  NON JSON METHOD  ///////////////////////////
const { connect, disconnect } = require('./database')

// hard coded
const Size = require('../models/size')
const Topping = require('../models/toppings')

connect()
  .then(() => Size.remove({}))
  .then(() => Size.insertMany(sizes))
  .then(() => Topping.remove({}))
  .then(() => Topping.insertMany(toppings))
  .then(disconnect)
  .catch(console.error)

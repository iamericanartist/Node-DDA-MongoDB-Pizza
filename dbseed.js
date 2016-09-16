"use strict"

const { connect, disconnect } = require("./database")

const Size = require("./models/size")
const Topping = require("./models/toppings")

connect()
  .then(() => Size.remove({}))
  .then(() =>
    Size.insertMany([{
      name: 'Fun',
      inches: 2,
    },{
      name: 'Personal',
      inches: 8,
    },{
      name: 'Small',
      inches: 10,
    },{
      name: 'Medium',
      inches: 12,
    },{
      name: 'Large',
      inches: 14,
    },{
      name: 'Murica',
      inches: 1776,
    }])
  )
  .then(() => Topping.remove({}))
  .then(() =>
    Topping.insertMany([
      {name: 'Cheez'},
      {name: 'Meeet'},
      {name: 'MORE Cheez'},
      {name: 'MORE Meeet'},
      {name: 'not Meeet'}
    ])
  )
  .then(disconnect)
  .catch(console.error)

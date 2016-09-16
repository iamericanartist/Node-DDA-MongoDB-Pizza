"use strict"

// const express = require('express')
const { Router } = require('express')  //Alt of above doesn't meed "express.router"
const router = Router()

//MONGODB SETUP
// const { db } = require('../database')        //unneeded with MVC SETUP
const Contact = require('../models/contact')    //MVC SETUP
const Order = require('../models/order')        //MVC SETUP
const Size = require('../models/size')          //MVC SETUP
const Topping = require('../models/toppings')          //MVC SETUP

// routes
router.get ("/", (req, res) =>                                                 //this is the route for INDEX "/"
  res.render("index", { message: "This is my Main page!"})                  //render this page
)

router.get ("/about", (req, res) =>                                            //this is the route for ABOUT
  res.render("about", { page: "About", message: "This is my About page."})  //render this page
)

router.get ("/contact", (req, res) =>                                          // this is the route for CONTACT
  res.render("contact", { page: "Contact", message: "Get a Contact HI!"})   // render this page
)



// router.post ("/contact", (req, res) => {                                       // this is the POST route for CONTACT
//   console.log(req.body)
//     // res.render("contact", { page: "Contact", message: "HEY THERE!"})     // render this page
//     // res.send("Thanks for stopping by")                                   // render this page
//   res.redirect("/")
// })

// //MONGODB SETUP
// router.post ("/contact", (req, res) => {                                       // this is the POST route for CONTACT
//   db().collection('contact')
//     .insertOne(req.body)
//     .then(() => res.redirect('/'))
//     .catch(() => res.send('BAD'))
// })

//MONGOOSE SETUP
// const mongoose = require("mongoose")
// const Contact = mongoose.model("Contact")

router.post ("/contact", (req, res, err) => {                                       // this is the POST route for CONTACT
  Contact
    .create(req.body)
    .then(() => res.redirect('/'))
    .catch(err)
})

// router.get('/order', (req, res) => {
//   const sizes = Size.get()
//   res.render('order', { page: 'Order', sizes })
// })
// // [{ inches: 14, name: 'Large'},{ inches: 12, name: 'Medium' }]

//pre-PROMISES
// router.get('/order', (req, res) =>
//   Size
//   .find()
//   .sort({inches: 1 })
//   .then(sizes => res.render('order', { page: 'Order', sizes}))  //orig
//   // .then(sizes => res.render('order', { page: 'Order', sizes, toppings: [{name: 'Pepperoni'},{ name: 'Sausage'}, {name: 'Olives'}] })) //hardcoded to test connetcion to pug
// )
// // [{ inches: 14, name: 'Large'},{ inches: 12, name: 'Medium' }]

//PROMISE.ALL
router.get('/order', (req, res, err) =>
  Promise
    .all([
      Size.find().sort({ inches: 1 }),
  // .then(sizes => res.render('order', { page: 'Order', sizes}))  //orig
  // .then(sizes => res.render('order', { page: 'Order', sizes, toppings: [{name: 'Pepperoni'},{ name: 'Sausage'}, {name: 'Olives'}] })) //hardcoded to test connetcion to pug
      Topping.find().sort({ name: 1})
    ])
    .then(([sizes, toppings]) =>
      res.render('order', {page: 'Order', sizes, toppings})
    )
    .catch(err)
)



// [{ inches: 14, name: 'Large'},{ inches: 12, name: 'Medium' }]



// router.post('/order', (req, res, err) => {
//   Order
//     .create(req.body)
//     .then(() => res.redirect('/'))
//     .catch(err)
// })

////validation added (Scott version 1)
router.post('/order', ({ body }, res, err) =>
  Order
    .create(body)
    .then(() => res.redirect('/'))
    .catch(({ errors })  =>
      Promise.all([ // retrieve sizes and toppings again,
        Promise.resolve(errors), // but pass the errors along as well
        Size.find().sort({ inches: 1 }),
        Topping.find().sort({ name: 1 }),
      ])
    )
    .then(([
        errors,
        sizes,
        toppings,
      ]) =>
      // UI/UX additions
      // send errors to renderer to change styling and add error messages
      // also, send the req.body to use as initial form input values
      res.render('order', { page: 'Order', sizes, toppings, errors, body })
    )
    .catch(err)
)

module.exports = router

"use strict"

// const express = require('express')
const { Router } = require('express')  //Alt of above doesn't meed "express.router"
const bcrypt = require("bcrypt")

const router = Router()

//MONGODB SETUP
// const { db } = require('../database')        //unneeded with MVC SETUP
const Contact = require('../models/contact')    //MVC SETUP
const Order = require('../models/order')        //MVC SETUP
const Size = require('../models/size')          //MVC SETUP
const Topping = require('../models/toppings')   //MVC SETUP
const User = require('../models/user')          //MVC SETUP

// routes
////////////////////////////////////  LOGIN  ////////////////////////////////////
router.get("/login", (req, res) =>                                 //this is the route for INDEX "/"
  res.render("login", { message: "Please Login!"})                  //render this page
)

// router.post('/login', (req, res) => {
//   if (req.body.password === 'password') {
//     User
//       .then(() => res.redirect('/'))
//       .catch(err)
//     // res.redirect('/')
//   } else {
//     res.render('login', { error: 'Email & password combination do not match' })
//   }
// })

///////////////////////////////////  SCOTTS  ///////////////////////////////////
router.post('/login', ({session, body: { email, password } }, res, err) => {
  User.findOne({ email })
    .then(user => {
      if (user) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, matches) => {
            if (err) {
              reject(err)
            } else {
              resolve(matches)
            }
          })
        })
      } else {
        res.render('login', { msg: 'Email does not exist in our system' })
      }
    })
    .then((matches) => {
      if (matches) {
        session.email = email   // was req.session.email but we destructured session above ("router.post" line)
        res.redirect('/')
      } else {
        res.render('login', { msg: 'Password does not match' })
      }
    })
    .catch(err)
})
      // if (user && password === user.password) {
      //   res.redirect('/')
      // } else if (user) {
      //   res.render('login', { msg: 'Password does not match' })
      // } else {
      //   res.render('login', { msg: 'Email does not exist in our system' })
      // }
    // })
    // .catch(err)
// })

//////////////////////////////////  REGISTER  //////////////////////////////////
router.get("/register", (req, res) =>                                      //this is the route for INDEX "/"
  res.render("register", { message: "Register"})          //render this page
)

// router.post("/register", (req, res, err) => {                                       // this is the POST route for CONTACT
//   if (req.body.password === req.body.confirmation) {
//     User
//       .create(req.body)
//       .then(() => res.redirect('/'))
//       .catch(err)
//   } else {
//     res.render('register', {error: "Password & password confirmation don't match"})
//   }
// })


///////////////////////////////////  SCOTTS  ///////////////////////////////////
router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
  if (password === confirmation) {
    User.findOne({ email })
      .then(user => {
        if (user) {
          res.render('register', { msg: 'Email is already registered' })
        } else {
          return new Promise((resolve, reject) => {
            bcrypt.hash(password, 15, (err, hash) => {
              if (err) {
                reject(err)
              } else {
                resolve(hash)
              }
            })
          })
          // return User.create({ email, password })
        }
      })
      .then(hash => User.create({ email, password: hash}))
      .then(() => res.redirect('/login'), { msg: 'User created' })
      .catch(err)
  } else {
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})








////////////////////////////////////  INDEX  ////////////////////////////////////
router.get ("/", (req, res) =>                                      //this is the route for INDEX "/"
  res.render("index", { message: "This is my Main page!"})          //render this page
)


////////////////////////////////////  ABOUT  ////////////////////////////////////
router.get ("/about", (req, res) =>                                           //this is the route for ABOUT
  res.render("about", { page: "About", message: "This is my About page."})    //render this page
)


///////////////////////////////////  CONTACT  ///////////////////////////////////
router.get ("/contact", (req, res) =>                                         // this is the route for CONTACT
  res.render("contact", { page: "Contact", message: "Get a Contact HI!"})     // render this page
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



///////////////////////////////////  LOGOUT  ///////////////////////////////////

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err
    res.redirect('/login')
  })  
})


///////////////////////////  GUARD MIDDLEWARE  ///////////////////////////
// login guard middleware
router.use((req, res, next) => {
  if (req.session.email) {
    next()
  } else {
    res.redirect('/login')
  }
})


///////////////////////////////  GUARDED LOGOUT  ///////////////////////////////
//// pre guarded
// router.get('/logout', (req, res) => {
//   if (req.session.email) {
//     res.render('logout', { page: 'Logout'})
//   } else {
//     res.redirect('/login')
//   }
// })

router.get('/logout', (req, res) =>
  res.render('logout', { page: 'Logout'})
)
  

////////////////////////////////  GUARDED ORDER  ////////////////////////////////
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

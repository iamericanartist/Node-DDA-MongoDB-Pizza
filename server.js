"use strict"

////////////////////////////////// SETTING UP //////////////////////////////////
// npm init
// npm install express pug --save

// LATER...
// npm install bower
// bower init --y
// node_modules/.bin/bower init
// touch .bowerrc
// node_modules/.bin/bower install bootstrap --save

// WAY LATER...
// npm install body-parser --save


//////////////////////////////////  REQUIRES  //////////////////////////////////
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const chalk = require("chalk")
const { cyan, red } = require("chalk")
const routes = require("./routes/")                     // same as ./routes/index.js

// USING PASSPORT AUTH
const passport = require("passport")
const session = require("express-session")
const RedisStore = require("connect-redis")(session)    //grabbing from line above and adding it here

const { connect } = require("./db/database")            // USING mLAB DATABASE

//get port from environment and store in Express
const port = process.env.PORT || 3000
app.set("port", port)

// sets engine to pug (which is already an engine)
app.set("view engine", "pug")


////////////////////////////////////  OTHER  ////////////////////////////////////
app.locals.company = "Slyce of Lyfe"
app.locals.errors = {}      // errors & body added to avoid guard statements
app.locals.body = {}        // i.e. value=(body && body.name) vs. value=body.name

if (process.env.NODE_ENV !== "production"){
app.locals.pretty = true                    // "app.locals.pretty" makes the terminal output of "curl localhost:3000" look like html
}


/////////////////////////  MIDDLEWARES (Above Routes)  /////////////////////////

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))


app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || "redis://localhost:6379" //redis hooked up to HEROKU
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || "sliceoflyfesecretkey",
}))


require('./lib/passport-strategies')
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.email = req.user && req.user.email
  next()
})

app.use(({ method, url, headers: { 'user-agent': agent } }, res, next) => {
  const timeStamp = new Date()
  console.log(`[${timeStamp}] "${cyan(`${method} ${url}`)}" "${agent}"`)
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))


//////////////////////////////////  ROUTES  ////////////////////////////////////
app.use(routes)


///////////////////////////////  CUSTOM 404 PAGE  ///////////////////////////////
app.use((req, res) =>
  res.render("404")
)


//ERROR HANDLING MIDDLEWARES ACTUAL
app.use((
    err,
    { method, url, headers: { 'user-agent': agent } },
    res,
    next
  ) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendStatus(err.status || 500)
  } else {
    res.set('Content-Type', 'text/plain').send(err.stack)
  }
    const timeStamp = new Date()
    const statusCode = res.statusCode
    const statusMessage = res.statusMessage

    console.error(
      `[${timeStamp}] "${red(`${method} ${url}`)}" Error (${statusCode}): "${statusMessage}"`
    )
    console.error(err.stack)
  }
)


///////////  Listen to requests on provided port, log when available  ///////////
//MONGODB
connect()
  .then(() => {
    app.listen(port, () =>
      console.log(`Listening on port: ${port}`)
    )
  })
  .catch(console.error)

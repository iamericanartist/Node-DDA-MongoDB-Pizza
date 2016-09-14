'use strict'

// for Mongoose:
const mongoose = require('mongoose')

const MONGODB_URL = 'mongodb://localhost:27017/SliceOfLyfe'

mongoose.Promise = Promise

module.exports.connect = () => mongoose.connect(MONGODB_URL)



// for MongoDB:
// 'use strict'

// const { MongoClient: { connect } } = require('mongodb')    //for MongoDB
// const MONGODB_URL = 'mongodb://localhost:27017/SliceOfLyfe'
// let db
// module.exports.connect = () => connect(MONGODB_URL).then(_db => db = _db)
// module.exports.db = () => db

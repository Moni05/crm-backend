const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongooseURL = process.env.MONGO_URL;

mongoose.connect( mongooseURL, { useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('connected', ()=>{
    console.log("Mongodb connected successfully");
})

db.on('error',()=>{
    console.log("Mongodb connection failed");
})

module.exports = mongoose;
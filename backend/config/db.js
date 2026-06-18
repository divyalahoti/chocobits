
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const connectDB = async () => {

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));



};

module.exports = connectDB;




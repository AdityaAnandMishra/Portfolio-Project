const express = require("express");
const config = require('config');
const { default: mongoose } = require("mongoose");
const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoose.connect(db,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Mongoose Database is runing ...");
    } catch(err){
        console.log(err.message);
        //Exit process with failure
        process.exit(1);    
    }
}

module.exports = connectDB
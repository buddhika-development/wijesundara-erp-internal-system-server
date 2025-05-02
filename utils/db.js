const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


// create database connection
const db_connection = async() => {

    // access database connection string
    const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECITON_STRING;


    if(MONGO_CONNECTION_STRING != null) {

        try{
            mongoose.connect(MONGO_CONNECTION_STRING)
            console.log("DB Successfully connected")
        }
        catch(err) {
            console.log("Something went wrong..")
        }
    }
    else {
        console.log("There is database connection violate")
    }
    
} 

module.exports = db_connection
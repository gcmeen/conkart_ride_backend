const mongoose = require('mongoose');
const config = require('../config/config')
const connectDb = async ()=>{
    return await new Promise((resolve,reject)=>{
      mongoose.connect(config.dbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .then(() => {
          console.log("Successfully connect to MongoDB.");
          resolve(true)
        })
        .catch(err => {
          console.error("Connection error", err);
          process.exit();
        });
      
    })
}

module.exports={connectDb}
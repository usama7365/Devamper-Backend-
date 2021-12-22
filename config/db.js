const mongoose = require('mongoose')
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongoDB connect: ${conn.connection.host}`.rainbow.bold);
}

module.exports = connectDB
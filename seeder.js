const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

console.log('usama')
// Load env vars
dotenv.config({ path: "./config/config.env" })

//load models
const Bootcamp = require('./model/bootcamp')
const Courses = require('./model/courses')
const User = require('./model/User')
const Review = require('./model/reviews')

//import into db 
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Courses.create(courses)
        await User.create(User)
        await Review.create(review)

        console.log('Data imported........'.green.inverse)
        process.exit(1)
    }
    catch (err) {
        console.log(err)
    }
}
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Courses.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()


        console.log('Data Demolish........'.red.inverse)
        process.exit(1)
    }
    catch (err) {
        console.log(err);
    }
}

//connect to db 
mongoose.connect(process.env.MONGO_URL)

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const user= JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));   
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));
const review = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));
 

if (process.argv[2] === '-i') {
    importData()
    
}

else if (process.argv[2] === '-d') {
    deleteData()
}



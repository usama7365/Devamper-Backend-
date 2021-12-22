const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
// const logger = require("./middleware/logger")
const errorHandler = require('./middleware/Error')
const colors = require('colors')
const auth = require('./Routes/auth')
const courses = require('./Routes/course')
const cookieparser = require('cookie-parser')
const fileupload = require('express-fileupload')
const user = require('./Routes/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
var xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')

//import Routes file

const bootcamps = require('./routes/bootcamps')
//importdb
const connectDB = require('./config/db')

//load env config file

dotenv.config({ path: './config/config.env' })
//connect mongoDB
connectDB()

const app = express()

//body parser
app.use(express.json())
app.use(cookieparser())
app.use(fileupload())




//  set static folder 

app.use(express.static(path.join(__dirname, 'public')))

app.use(errorHandler)

//Routes courses
app.use('/api/v1/courses', courses)
//Mout router
app.use('/api/v1/bootcamps', bootcamps)

//Routes auth
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);

// To remove data, use:
app.use(mongoSanitize());

//cookien 

// set security header
app.use(helmet());

// app.use(logger)


// prevent xss attacks
app.use(xss())



// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 1
 });
 app.use(limiter);
 
 // Prevent http param pollution
 app.use(hpp());
 
 app.use(cors())
 

//DEv logging Middleware

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

//define port

const PORT = process.env.PORT || 6000

const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.italic.bold);
});

// handle unhandle promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.mesaage}`.red.bold);

    // close server & exit process11111
    server.close(() => { process.exit(1) })

})

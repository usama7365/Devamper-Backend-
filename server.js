const express = require("express")
const dotenv = require("dotenv")

dotenv.config({ path: "./config/config.env" })


const app = express()


const port = process.env.PORT || 6000

app.listen(port, () => {


    console.log("server is ruining in  port 4000");

})
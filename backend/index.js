const express = require("express")
const cors = require("cors")
const app = express()
const mongoose=require("mongoose")
const userRoutes=require("./Routes/userRoutes")
const chatRoute = require("./Routes/chatRouts")
const messageRoute= require("./Routes/messageRouts")
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/api/users",userRoutes)
app.use("/api/chats",chatRoute)
app.use("/api/message",messageRoute)

port=process.env.PORT
uri=process.env.ATLAS_URI
app.listen(port,(req,res)=>{
    console.log(`server running on port ${port}`)
})

mongoose.connect(uri,
    ).then(()=>console.log("connceted successfully to DB")
).catch((error)=>console.log(`catch error: ${error}`))
const mongoose = require("mongoose")

const chatSchema = mongoose.Schema(
    {
        members:Array,
    },
    {
        timestamp:true,
    }
)

const chatModel = mongoose.model("Chat",chatSchema)

module.exports=chatModel
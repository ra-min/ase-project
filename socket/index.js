const {Server} = require("socket.io")


let onLineUsers=[]

const io = new Server({cors:"http://localhost:3000"})
io.on("connection",(socket)=>{
    console.log("new connection",socket.id)
    socket.on("addNewUser",(userId)=>{
        !onLineUsers.some(user=>user.userId===userId) &&
        onLineUsers.push({
            userId,
            socketId:socket.id
        })
        console.log("onlineUsers",onLineUsers)
        io.emit("geOnLineUsers",onLineUsers)
    })
    socket.on("sendMessage",(message)=>{
        const user=onLineUsers.find(user=> user.userId===message.recipientId)
        if (user){
            io.to(user.socketId).emit("getMessage",message)
            io.to(user.socketId).emit("getNotification",{
                senderId:message.senderId,
                isRead : false,
                data: new Date()
            })
        }
    })
    socket.on("disconnect",()=>{
        onLineUsers = onLineUsers.filter((user)=>user.socketId !== socket.id)
        io.emit("geOnLineUsers",onLineUsers)
    })
})
io.listen(3030)
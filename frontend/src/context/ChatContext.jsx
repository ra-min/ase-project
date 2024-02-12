import { createContext,useEffect,useState,useCallback } from "react";
import { baseUrl,getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"
import { useParams } from "react-router-dom";

export const ChatContext=createContext()


export const ChatContextProvider=({children,user})=>{
    const [userChats,setUserChats]=useState([])
    const [isUserChatsLoading,setIsUserChatsLoading]=useState(false)
    const [userChatsError,setUserChatsError]=useState(null)
    const [potentialChats,setPotentialChats] = useState([])
    const [currnetChat,setCurrentChat]=useState(null)
    const [messages,setMessges]=useState(null)
    const [isMessagesLoading,setIsMessageLoading]=useState(false)
    const [messagesError,setMessageError]=useState(null)
    const [sendTextMessageError,setSendTextMessageError]=useState(null)
    const [newMessage,setNewMessage]=useState(null)
    const [socket,setSocket]=useState(null)
    const [onLineUsers,setOnLineUsers]=useState([])
    const [notifications,setNotification]=useState([])
    const [allUsers,setAllUsers]=useState([])
    const [simpleChatTOF,setSimplateChatTOF]=useState(false)

    console.log("current",currnetChat)
    
    useEffect(()=>{
        const newSocket=io("http://localhost:3030")
        setSocket(newSocket)
        return ()=>{
            newSocket.disconnect()
        }
    },[user])

    useEffect(()=>{

        const getUsers = async ()=>{
            const response = await getRequest(`${baseUrl}/users`)
            if (response.error){
                return
                
            }
            const potenChats = response.filter((u)=>{
                let isChatCreated= false 
                if (user?._id===u._id) return false

                if (userChats){
                    isChatCreated = userChats?.some((chat)=>{
                        return chat.members[0]===u._id || chat.members[1]==u._id
                    })
                }
                return !isChatCreated
            })
        
            setPotentialChats(potenChats)
            setAllUsers(response)
        }
        getUsers()

    },[user,userChats])
//get onlinet users
    useEffect(()=>{
        if (socket === null) return
        socket.emit("addNewUser",user?._id)
        socket.on("geOnLineUsers",(response)=>{

            setOnLineUsers(response)

        })
        return ()=>{
            socket.off("getOnLineUsers")
        }
        
    },[socket,user])



//send message

useEffect(()=>{
    if (socket === null) return
    
    const recipientId = currnetChat?.members?.find((id)=>id !==user?._id)

    socket.emit("sendMessage",{...newMessage,recipientId})

},[newMessage,user])




//get message and notification

useEffect(()=>{
    if (socket === null) return
    socket.on("getMessage",(message)=>{
        

        if ( currnetChat?._id !== message.chatId) return

        setMessges((prev)=>[...prev,message])
    })
    
    socket.on("getNotification",(res)=>{
        
        const isChatOpen=currnetChat?.members.some(id=> id ===res.senderId)
        console.log("getnotification : ",isChatOpen)
        if(isChatOpen){
            setNotification(prev=>[{...res, isRead : true},...prev])
        }else{
            setNotification(prev=>[res,...prev])
        }

    })
    
    return ()=>{
        socket.off("getMessage")
        
    }
},[socket,currnetChat])





    useEffect(()=>{
        const getUserChats = async() =>{
            
            if(user?._id){
                setIsUserChatsLoading(true)
                setUserChatsError(null)
                const response = await getRequest (`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false)
                if (response.error){
                    return setUserChatsError(response)
                }
                setUserChats(response)
            
            }
            
        }
        console.log("is update",user?._id)
        getUserChats()
    },[user,notifications])

const updateCurrentChat = useCallback((chat)=>{
    setCurrentChat(chat)

},[])







useEffect(()=>{
    const getMessages = async() =>{
        setIsMessageLoading(true)
        setMessageError(null)
        const response = await getRequest 
        (`${baseUrl}/message/${currnetChat?._id}`)
        
        setIsMessageLoading(false)
        if (response.error){
            return setMessageError(response)
        }
        setMessges(response)
    
        
            
    }
    getMessages()
},[currnetChat])


const sendTextMessage = useCallback
        (async(textMessage,sender,currentChatId,setTextMessage)=>{
            if(!textMessage) return console.log("type something")
            
            const response = await postRequest(
                `${baseUrl}/message`,
                JSON.stringify({
                    chatId:currentChatId,
                    senderId:sender._id,
                    text: textMessage
                })
            )
            if(response.error){
                return setSendTextMessageError(response)
            }
            setNewMessage(response)
            setMessges((prev)=>[...prev,response])
            setTextMessage("")


},[])

const createChat = useCallback (
    async (firstId,secondId)=>{
        const response = await postRequest(
            `${baseUrl}/chats`,
            JSON.stringify(({
                firstId,
                secondId
            }))
        )
        if(response.error){
            return
        }
        setUserChats((prev)=>[...userChats,response])
    }
,[userChats])




const markAllNotificationAsRead = useCallback((notifications)=>{
    const markAllRead = notifications.map((notif)=>{
        return {...notif,isRead : true}
    })
    setNotification(markAllRead)
}, [])


const markNotificationAsRead = useCallback((notif , userChats,user,notifications)=>{
    const desiredChat = userChats.find((chat)=>{
        const chatMembers =[user._id,notif.senderId]

        const isDesiredChat = chat?.members.every((member)=>{
            return chatMembers.includes(member)
        })
        return isDesiredChat
    })
    const markNotification = notifications.map((notifElement)=>{
        if (notif.senderId===notifElement.senderId){
            return {...notif,isRead:true}
        }else{
            return notifElement
        }
    })
    updateCurrentChat(desiredChat)
    setNotification(markNotification)
},[]) 



const markThisUserNotificatiosAsRead = useCallback((thisUserNotifications,notifications)=>{

    const markNotification = notifications.map(notifElement=>{
        let notification
        thisUserNotifications.forEach(notif=>{
            if (notif.senderId===notifElement.senderId){
                notification={...notif,isRead:true}
            }else{
                notification = notifElement
            }
        })
        return notification
    })
    setNotification(markNotification)
},[])


const simpleChatFunc = useCallback(
    async (secondId)=>{
        if(user?._id){
        
        const response = await getRequest (`${baseUrl}/chats/${user?._id}`)

                if (response.error){
                    return setUserChatsError(response)}

        const chat = response?.find((chat)=>
         chat.members[0]===secondId || chat.members[1]==secondId
        )
        if (!chat){
            
            await createChat(user?._id,secondId)
        }
        setCurrentChat(chat)
    }
    },[user])

    return (
        <ChatContext.Provider
        value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            currnetChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            newMessage,
            onLineUsers,
            notifications,
            allUsers,
            markAllNotificationAsRead,
            markNotificationAsRead,
            markThisUserNotificatiosAsRead,
            simpleChatFunc,
            user
            
        }}
        >
            {children}
            </ChatContext.Provider>
    )
}



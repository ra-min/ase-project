import {useContext, useEffect , useState } from "react"
import { baseUrl, getRequest } from "../utils/services"
import { ChatContext } from "../context/ChatContext"


export const useFetchLatestMessage = (chat)=>{
    const {newMessage,notifications} = useContext(ChatContext)
    const [latestMessage,setLatesMessage] = useState(null)

    useEffect(()=>{

        const getMessages = async ()=>{
            const response = await getRequest
            (`${baseUrl}/message/${chat?._id}`)
            if (response?.error){
                return console.log("Error getting messages")
            }
            const lastMessage = response[response?.length -1]
            setLatesMessage(lastMessage)
        }
        getMessages()
        
        
    },
    
    [newMessage,notifications])

    return {latestMessage}
}
import { useContext, useEffect, useState , useRef } from "react";

import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment"
import { Stack} from "react-bootstrap";
import InputEmoji from "react-input-emoji"
import send from "../../assest/send.svg"


const ChatBox = () => {

    const {currnetChat,messages,isMessagesLoading,sendTextMessage,user}=useContext(ChatContext)
    const {recipientUser}=useFetchRecipientUser(currnetChat,user)
    const [textMessage,setTextMessage] = useState(" ")
    const scroll = useRef()

    const hitEnter=(event)=>{
      if (event.key==="Enter"){
        sendTextMessage(
          textMessage,user,currnetChat._id,setTextMessage
        )
      }
    }
    
    useEffect(()=>{
      scroll.current?.scrollIntoView({behavior : "smooth"})
    },[messages])
    
    
    if (!recipientUser){
        return (
            <p style={{textAlign : "center" , width: "100%"}}>
                no conversation selected yet...
                </p>
        )

    }
    if (isMessagesLoading){
        return (
            <p style={{textAlign : "center" , width: "100%"}}>
                Loading chat .. 
                </p>
        )

    }
    
    
    return (
        <Stack gap={4} className="chat-box">
          <div className="chat-header">
            
            <strong>{recipientUser?.name}</strong>
          </div>
          <Stack gap={3} className="messages">
            {messages &&
              messages.map((message, index) => (
                
                <Stack
                  key={index}
                  className={`${
                    message?.senderId === user?._id
                      ? "message self align-self-end flex-grow-0"
                      : "message align-self-start flex-grow-0"
                  }`}
                  ref={scroll}

                >  
                
                  <span >{message.text}</span>
                  <span className="message-footer">
                    {moment(message.createAt).calendar()}
                  </span>
                </Stack>
              ))}
          </Stack>
          <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
          <InputEmoji 
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2"
          onKeyDown={(event)=>hitEnter(event)}
          />
          <button className="send-btn" onClick={()=>sendTextMessage(
            textMessage,user,currnetChat._id,setTextMessage
          )}
          >
          <img src={send}/>
           </button>
          </Stack>
        </Stack> 
      );
        
        
        
}

export default ChatBox;
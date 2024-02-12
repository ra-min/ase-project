import { useContext, useEffect, useState , useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

import moment from "moment"
import { Stack} from "react-bootstrap";
import InputEmoji from "react-input-emoji"
import send from "../../assest/send.svg"

const SimpleChat = ({resturanId}) => {

    const {currnetChat,messages,isMessagesLoading,sendTextMessage,simpleChatFunc,user}=useContext(ChatContext)
    //const currnetChat={_id:"65bfa1a20ca9170fd54ee9de",members:["65bf9f820ca9170fd54ee97c","65bf89320ca9170fd54ee45c"]}
    //
    const {recipientUser}=useFetchRecipientUser(currnetChat,user)
    const [textMessage,setTextMessage] = useState(" ")
    const [isChatOpen,setIsChatOpen]=useState(false)
    const scroll = useRef()
    console.log("check resturanId: ",resturanId)
    
    const hitEnter=(event)=>{
      if (event.key==="Enter"){
        sendTextMessage(
          textMessage,user,currnetChat._id,setTextMessage
        )
      }
    }
    useEffect(()=>{
      if (resturanId !==null){
      simpleChatFunc(resturanId)}
      resturanId=null
    },[])
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
          
      <div
      
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="35"
         height="35" 
         fill="currentColor" 
         className="Chat-text-fill" 
         viewBox="0 0 16 16"
         onClick={()=>setIsChatOpen(!isChatOpen)}
         points=""
         >
  <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
</svg>
      {isChatOpen && <Stack className="simple-chat-box" gap={4} >
          <div className="simple-chat-header">
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
          <Stack direction="horizontal" gap={3} className="simple-chat-input flex-grow-0">
          <InputEmoji 
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
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
       } </div>
      );
        
        
        
}

export default SimpleChat;
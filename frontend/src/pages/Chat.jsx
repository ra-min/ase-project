import { useContext , useParams} from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";

import ChatBox from "../components/chat/ChatBox"




const Chat = () => {
    
    const {userChats,
        isUserChatsLoading,
        userChatsError,
        updateCurrentChat,user}= useContext(ChatContext)
    
    return (<Container>
        
        {userChats?.length <1 ? null :(
            <Stack className="align-items-start" direction="horizontal" gap={"3"}>
                <Stack className="messages-box flex-grow-0 pe-3" gap={3} >
                    {isUserChatsLoading && <p>Loading chats...</p>}
                    {userChats?.map((chat,index)=>{
                        
                        return (
                            <div key={index} onClick={()=>updateCurrentChat(chat)}>
                                <UserChat chat={chat} user={user}/>
                            </div>
                        )
                    })}
                </Stack>

                <ChatBox/>
            </Stack>
        )}
    </Container>);
}
 
export default Chat;
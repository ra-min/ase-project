import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assest/avatar.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotifications } from "../../utils/ureadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchMessage";
import moment from "moment";

const UserChat = ({chat,user}) => {
    const {recipientUser}=useFetchRecipientUser(chat,user)
    const {onLineUsers,notifications,markThisUserNotificatiosAsRead}=useContext(ChatContext)
    const isOnLine = onLineUsers?.some((user)=> user?.userId===recipientUser?._id)
    
    const unreadNotifications_=unreadNotifications(notifications)
    
    const thisUserNotifications = unreadNotifications_.filter((notif)=>{
        return notif.senderId===recipientUser?._id
    })
    //console.log("unreadNotifications_",thisUserNotifications?.length)
    const {latestMessage} = useFetchLatestMessage(chat)
    const miniaturizeText = (text) =>{
        let shortText = text?.substring(0,20)+"..."

        if ( text?.length>20){
            text=shortText
        }
        if (user?._id===latestMessage?.senderId){
            text="you: "+text
        }
       
        return  text
    }
    
    return ( <Stack direction="horizontal"
    gap={3}
    className="user-card align-items-center p-2 justify-content-between"
    role="button"
    onClick={()=>{
        if (thisUserNotifications?.length!=0){
            markThisUserNotificatiosAsRead(
                thisUserNotifications,notifications
            )
        }
    }}
    >
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} height={"30px"} /> 
            </div>
            <div className="text-center">
                <div className="name">{recipientUser?.name}
                
                </div>
                <div className="text">{miniaturizeText(latestMessage?.text)}</div> 
            </div>

        </div>
        <div className="d-flex flex-column align-items-end">
        <span className={isOnLine ? "user-online" : ""}></span>
            <div className="date">{moment(latestMessage?.createAt).calendar}</div>
            <div className={thisUserNotifications?.length > 0 
            ?"this-user-notifications"
            : ""
        }>{thisUserNotifications?.length > 0 
            ? thisUserNotifications?.length
            : ""}
            </div>
            
        </div>
        
    </Stack>);
}
 
export default UserChat;
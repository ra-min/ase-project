import {Routes,Route} from "react-router-dom"
import Chat from "./pages/Chat"

import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";

import { ChatContextProvider} from "./context/ChatContext";

import Restorantpage from "./pages/restoranpage";



function App() {
  const user = JSON.parse(localStorage.getItem("User"))
  
  return (<>
  <ChatContextProvider user={user}>
  <Container >
    <Routes>
      
      
      <Route path="/chat" element ={<Chat/>}/>
      <Route path="/:restoranId" element ={<Restorantpage/>}/>
    </Routes>
    </Container>
    </ChatContextProvider>
  </>);
}

export default App;

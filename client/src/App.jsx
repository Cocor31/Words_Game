import { BrowserRouter, Route, Routes } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
const socket = socketIO.connect('http://localhost:5000');

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
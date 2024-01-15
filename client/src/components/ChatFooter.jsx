import React, { useState } from 'react';

const ChatFooter = ({ socket }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && localStorage.getItem('userName')) {
            const date = new Date()
            const name = localStorage.getItem('userName')
            socket.emit('message', {
                text: message,
                name: name,
                id: `${name}_${date.toISOString()}`,
                date: date,
                socketID: socket.id,
            });
        }
        console.log({ userName: localStorage.getItem('userName'), message });
        setMessage('');
        socket.emit('typing', "");
    };

    const handleTyping = (e) => {
        setMessage(e.target.value)
        if (e.target.value.length > 0) {
            socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
        } else {
            socket.emit('typing', "");
        }

    };

    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={handleTyping}//{(e) => setMessage(e.target.value)}
                // onKeyDown={handleTyping}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [isChatActive, setIsChatActive] = useState(true);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const isChatExpired = (expiresAt) => {
    if (!expiresAt) return true;
    return new Date(expiresAt) < new Date();
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/chat', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setChats(res.data);
      } catch (err) {
        console.error('Error fetching chats:', err);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      if (msg.chat === activeChat?._id) {
        // Only add the incoming message if it's not from the current user
        // or if we can't determine that it's a message we've already added optimistically
        const isMine = String(msg.sender._id) === String(user.user.id);
        if (!isMine) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    socket.on('receive-message', handleIncomingMessage);
    return () => socket.off('receive-message', handleIncomingMessage);
  }, [socket, activeChat, user.user.id]);

  const loadMessages = async (chatId) => {
    try {
      const res = await axios.get(`/api/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSelectChat = async (chat) => {
    const expired = isChatExpired(chat.expiresAt);
    
    setActiveChat(chat);
    setIsChatActive(!expired);
    await loadMessages(chat._id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    // Store message content before clearing input
    const messageContent = newMsg;
    // Clear input field immediately for better UX
    setNewMsg('');
    
    try {
      // Create message object with correct sender info before sending
      const tempId = Date.now().toString(); // Temporary ID
      const newMessage = {
        _id: tempId,
        content: messageContent,
        sender: {
          _id: user.user.id
        },
        chat: activeChat._id
      };
      
      // Optimistically add to UI first with correct styling
      setMessages(prev => [...prev, newMessage]);
      
      // Then send to server
      const res = await axios.post(
        '/api/chat/message',
        { chatId: activeChat._id, content: messageContent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Don't update messages with server response - keep our optimistic update
      // Just emit to socket
      socket.emit('send-message', res.data);
    } catch (err) {
      console.error('Message send failed:', err);
      // Optionally show an error notification to the user
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-1/3 border-r border-gray-200 dark:border-slate-700 overflow-y-auto p-4 bg-white dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Chats</h2>
        <div className="space-y-2">
          {chats.map((chat) => {
            const otherUser = chat.users.find(
              (u) => u._id?.toString() !== user.user.id?.toString()
            );

            const isActive = activeChat?._id === chat._id;
            const expired = isChatExpired(chat.expiresAt);

            return (
              <div
                key={chat._id}
                className={`p-2 rounded transition ${
                  expired
                    ? 'opacity-60 text-gray-500 bg-red-50 dark:bg-red-800 cursor-pointer'
                    : isActive
                    ? 'bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 cursor-pointer'
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                {otherUser?.name}
                {expired && (
                  <span className="ml-2 text-xs text-red-500">(Expired)</span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg) => {
            const isMine = String(msg.sender._id) === String(user.user.id);
            return (
              <div
                key={msg._id}
                className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
                  isMine
                    ? 'ml-auto bg-green-500 text-white dark:bg-green-400 dark:text-black'
                    : 'bg-gray-200 text-black dark:bg-slate-700 dark:text-white'
                }`}
              >
                {msg.content}
              </div>
            );
          })}
        </div>

        {activeChat && (
          <form
            onSubmit={sendMessage}
            className="flex p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-blue-500 dark:bg-slate-700 p-2 rounded text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                isChatActive ? 'Type a message...' : 'Chat expired. Message history only.'
              }
              disabled={!isChatActive}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!isChatActive}
            >
              Send
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
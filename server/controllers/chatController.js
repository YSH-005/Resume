const Chat = require('../models/Chat');
const Message = require('../models/Message');

// controllers/chatController.js
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id })
      .populate('users', 'name email')
      .populate('booking', 'date slot')
      .select('users isActive booking createdAt expiresAt'); // include expiresAt

    const now = new Date();

    for (const chat of chats) {
      if (chat.expiresAt && now > new Date(chat.expiresAt)) {
        if (chat.isActive) {
          chat.isActive = false;
          await chat.save();
        }
      }
    }

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};


    




exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).populate('sender', 'name');
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  if (!chat.isActive) {
  return res.status(403).json({ message: 'Chat is closed. You can only view message history.' });
}


  const message = await Message.create({
    chat: chatId,
    sender: req.user.id,
    content
  });

  res.status(201).json(message);
};


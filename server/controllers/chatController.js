const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user.id }).populate('users', 'name email');
  res.json(chats);
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).populate('sender', 'name');
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const message = await Message.create({
    chat: chatId,
    sender: req.user.id,
    content
  });
  res.status(201).json(message);
};

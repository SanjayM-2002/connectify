import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Conversation from '../models/conversationModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import Message from '../models/messageModel.js';
import { getRecipientId, io } from '../socket/socket.js';

// Send Message

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const maxLength = 500;
    if (message.length > maxLength) {
      return res.status(400).json({
        error: `Text must be less than ${maxLength} characters`,
      });
    }

    // Check if already there exists a conversation between sender and recipient, if not create one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });

      conversation.lastMessage = {
        text: message,
        sender: senderId,
      };

      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await newMessage.save();

    // Update the lastMessage field in the conversation
    await Conversation.updateOne(
      { _id: conversation._id },
      {
        $set: {
          lastMessage: {
            text: message,
            sender: senderId,
          },
        },
      }
    );

    const recipientSocketId = getRecipientId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
    console.log('Message sent successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in sending message', err.message);
  }
};

// Get Messages

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in get message', err.message);
  }
};

const getConversations = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: 'participants',
      select: 'userName profilePic name',
    });

    // remove the current user from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in Getting conversations', err.message);
  }
};

export { sendMessage, getMessages, getConversations };

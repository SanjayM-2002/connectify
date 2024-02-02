import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import selectedConversationAtom from '../atoms/selectedConversationAtom';
import { useRecoilState } from 'recoil';
import conversationsAtom from '../atoms/conversationsAtom';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;
    if (!selectedConversation.userId) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedConversation.userId,
          message: messageText,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      console.log(data);
      setMessages((messages) => [...messages, data]);
      setConversations((prevConvos) => {
        const updatedConvos = prevConvos.map((conv) => {
          if (conv._id === selectedConversation._id) {
            return {
              ...conv,
              lastMessage: {
                text: data.text,
                sender: data.sender,
              },
            };
          }
          return conv;
        });
        return updatedConvos;
      });
    } catch (err) {
      console.log('Err is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setMessageText('');
    }
  };
  return (
    <>
      <form onSubmit={handleSendMessage}>
        <InputGroup>
          <Input
            w={'full'}
            placeholder='Type your message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement>
            <IoSend
              color='white'
              onClick={handleSendMessage}
              cursor={'pointer'}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  );
};

export default MessageInput;

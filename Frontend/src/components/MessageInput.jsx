import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import useImagePreview from '../hooks/useImagePreview';
import conversationsAtom from '../atoms/conversationsAtom';
import selectedConversationAtom from '../atoms/selectedConversationAtom';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imageURL, setImageURL } = useImagePreview();
  const [isSending, setIsSending] = useState(false);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imageURL) return;
    if (isSending) return;
    setIsSending(true);
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
          img: imageURL,
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
      setMessageText('');
      setImageURL('');
    } catch (err) {
      console.log('Err is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setIsSending(false);
    }
  };
  return (
    <>
      <Flex gap={2} alignItems={'center'}>
        <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
          <InputGroup>
            <Input
              w={'full'}
              placeholder='Type your message'
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
            <InputRightElement>
              <IoSendSharp
                color='white'
                onClick={handleSendMessage}
                cursor={'pointer'}
              />
            </InputRightElement>
          </InputGroup>
        </form>
        <Flex flex={5} cursor={'pointer'}>
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <Input
            type={'file'}
            hidden
            ref={imageRef}
            onChange={handleImageChange}
          />
        </Flex>
        <Modal
          isOpen={imageURL}
          onClose={() => {
            onClose();
            setImageURL('');
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex mt={5} w={'full'}>
                <Image src={imageURL} />
              </Flex>
              <Flex justifyContent={'flex-end'} my={2}>
                {!isSending ? (
                  <IoSendSharp
                    size={24}
                    cursor={'pointer'}
                    onClick={handleSendMessage}
                  />
                ) : (
                  <Spinner size={'md'} />
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default MessageInput;

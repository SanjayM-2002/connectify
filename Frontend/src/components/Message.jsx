import React from 'react';
import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { BsCheck2All } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedConversationAtom from '../atoms/selectedConversationAtom';
import userAtom from '../atoms/userAtom';

const Message = ({ ownMessage, message }) => {
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={'flex-end'}>
          <Text
            bg={'blue.400'}
            maxW={'350px'}
            p={1}
            borderRadius={'md'}
            color={'white'}
          >
            {message.text}
          </Text>

          <Avatar
            name={currentUser.name}
            src={currentUser.userProfilePic}
            w='7'
            h={7}
          />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar
            name={selectedConversation.name}
            src={selectedConversation.userProfilePic}
            w='7'
            h={7}
          />
          <Text
            bg={'green.400'}
            maxW={'350px'}
            p={1}
            borderRadius={'md'}
            color={'black'}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;

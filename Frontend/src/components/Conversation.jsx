import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import selectedConversationAtom from '../atoms/selectedConversationAtom';
import { useColorMode as chakraUseColorMode } from '@chakra-ui/react';

const Conversation = ({ conversation, isOnline }) => {
  const currentUser = useRecoilValue(userAtom);
  const otherUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  // console.log('Selected convo details: ', selectedConversation);

  return (
    <>
      <Flex
        gap={4}
        alignItems={'center'}
        p={'1'}
        _hover={{
          cursor: 'pointer',
          bg: useColorModeValue('gray.600', 'gray.dark'),
          color: 'white',
        }}
        borderRadius={'md'}
        onClick={() =>
          setSelectedConversation({
            _id: conversation._id,
            userId: otherUser._id,
            userName: otherUser.userName,
            userProfilePic: otherUser.profilePic,
            name: otherUser.name,
            dummy: conversation.dummy,
          })
        }
        bg={
          selectedConversation._id === conversation._id
            ? chakraUseColorMode === 'light'
              ? 'gray.800'
              : 'gray.500'
            : 'blue.500'
        }
      >
        <WrapItem>
          <Avatar
            size={{
              base: 'xs',
              sm: 'sm',
              md: 'md',
            }}
            name={otherUser.name}
            src={otherUser.profilePic}
          >
            {isOnline && <AvatarBadge boxSize='1em' bg='green.500' />}
          </Avatar>
        </WrapItem>
        <Stack direction={'column'} fontSize={'sm'}>
          <Text fontWeight='700' display={'flex'} alignItems={'center'}>
            {otherUser.userName}
            <Image src='/verified.png' w={4} h={4} ml={1} />
          </Text>
          <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
            {currentUser._id === lastMessage.sender ? (
              <Box color={lastMessage.seen ? 'blue.400' : ''}>
                <BsCheck2All size={16} />
              </Box>
            ) : (
              ''
            )}
            {lastMessage.text.length > 15
              ? lastMessage.text.substring(0, 15) + '...'
              : lastMessage.text}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default Conversation;

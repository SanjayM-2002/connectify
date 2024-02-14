import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import conversationsAtom from '../atoms/conversationsAtom';
import selectedConversationAtom from '../atoms/selectedConversationAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on('messagesSeen', ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch('/api/messages/conversations', {
          method: 'GET',
        });
        const data = await res.json();
        if (data.error) {
          console.log('Error in getting conversations: ', data.error);
          showToast('Error', data.error, 'error');
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (err) {
        showToast('Error', err, 'error');
        console.log('Error is: ', err);
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleSearchConversation = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`, {
        method: 'GET',
      });
      const searchedUser = await res.json();
      if (searchedUser.error) {
        console.log('Error in getting conversations: ', searchedUser.error);
        showToast('Error', searchedUser.error, 'error');
        return;
      }
      console.log('Searched User is: ', searchedUser);

      // If user is trying to search himself
      if (searchedUser._id === currentUser._id) {
        showToast('Error', 'You cannot message yourself', 'error');
        setSearching(false);
      }

      // If user is already in a conversation with searched user, we will open that conversation
      if (
        conversations.find(
          (convo) => convo.participants[0]._id === searchedUser._id
        )
      ) {
        setSelectedConversation({
          _id: conversations.find(
            (convo) => convo.participants[0]._id === searchedUser._id
          )._id,
          userId: searchedUser._id,
          userName: searchedUser.userName,
          name: searchedUser.name,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const dummyConversation = {
        dummy: true,
        lastMessage: {
          text: '',
          sender: '',
        },
        _id: toString(Date.now()),
        participants: [
          {
            _id: searchedUser._id,
            userName: searchedUser.userName,
            profilePic: searchedUser.profilePic,
            nbame: searchedUser.name,
          },
        ],
      };
      setConversations((prevConvos) => [...prevConvos, dummyConversation]);
    } catch (err) {
      showToast('Error', err, 'error');
      console.log('Error is: ', err);
    } finally {
      setSearching(false);
    }
  };
  return (
    <>
      <Box
        position={'absolute'}
        left={'50%'}
        w={{ base: '100%', md: '80%', lg: '750px' }}
        p={4}
        transform={'translateX(-50%)'}
      >
        <Flex
          gap={4}
          flexDirection={{ base: 'column', md: 'row' }}
          maxW={{
            sm: '400px',
            md: 'full',
          }}
          mx={'auto'}
        >
          <Flex
            flex={30}
            gap={2}
            flexDirection={'column'}
            maxW={{ sm: '250px', md: 'full' }}
            mx={'auto'}
          >
            <Text
              fontWeight={700}
              color={useColorModeValue('gray.600', 'gray.400')}
            >
              Your Conversations
            </Text>

            <form onSubmit={handleSearchConversation}>
              <Flex alignItems={'center'} gap={2}>
                <Input
                  placeholder='Search for a user'
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
                <Button
                  size={'sm'}
                  onClick={handleSearchConversation}
                  isLoading={searching}
                >
                  <SearchIcon />
                </Button>
              </Flex>
            </form>

            {loadingConversations &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <>
                  <Flex
                    key={i}
                    gap={4}
                    alignItems={'center'}
                    p={1}
                    borderRadius={'md'}
                  >
                    <Box>
                      <SkeletonCircle size={10} />
                    </Box>
                    <Flex w={'full'} flexDirection={'column'} gap={3}>
                      <Skeleton h={'10px'} w={'80px'} />
                      <Skeleton h={'8px'} w={'90%'} />
                    </Flex>
                  </Flex>
                </>
              ))}

            {!loadingConversations &&
              conversations.map((convo) => (
                <Conversation
                  key={convo._id}
                  conversation={convo}
                  isOnline={onlineUsers.includes(convo.participants[0]._id)}
                />
              ))}
          </Flex>

          {!selectedConversation._id && (
            <Flex
              flex={70}
              borderRadius={'md'}
              p={2}
              flexDir={'column'}
              alignItems={'center'}
              justifyContent={'center'}
              height={'400px'}
            >
              <GiConversation size={100} />
              <Text fontSize={20}>
                Select a conversation to start messaging
              </Text>
            </Flex>
          )}

          {selectedConversation._id && <MessageContainer />}
        </Flex>
      </Box>
    </>
  );
};

export default ChatPage;

import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
import { Link as RouterLink } from 'react-router-dom';

const Comment = ({ reply, lastReply }) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={'full'}>
        <RouterLink to={`/${reply.userName}`}>
          <Avatar src={reply.userProfilePic} size={'sm'} />
        </RouterLink>

        <Flex gap={1} w={'full'} flexDirection={'column'}>
          <Flex
            w={'full'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {' '}
              {reply.userName}
            </Text>
            {/* <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray'}>
                {}
              </Text>
              <BsThreeDots />
            </Flex> */}
          </Flex>
          <Text>{reply.text}</Text>

          {/* May include actions*/}

          {/* <Text fontSize={'sm'} color={'gray'}>
            {likes + (liked ? 1 : 0)} likes
          </Text> */}
        </Flex>
      </Flex>

      {!lastReply && <Divider my={4} />}
    </>
  );
};

export default Comment;

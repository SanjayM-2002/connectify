import { Avatar, Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

const UserPost = ({ postImage, postTitle, likes, replies }) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <div>UserPost</div>
      <Link href='/markzuckerberg/post/1'>
        Post 1
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Avatar size={'md'} name='Mark Zuckerberg' src='/zuck-avatar.png' />
            <Box w={'1px'} h={'full'} bg={'gray'} my={2}></Box>
            <Box position={'relative'} w={'full'}>
              <Avatar
                size={'xs'}
                name='Dan Abrahmov'
                src='https://bit.ly/dan-abramov'
                position={'absolute'}
                top={'0px'}
                left={'15px'}
                padding={'2px'}
              />
              <Avatar
                size={'xs'}
                name='Kent Dodds'
                src='https://bit.ly/kent-c-dodds'
                position={'absolute'}
                bottom={'0px'}
                right={'0px'}
                padding={'2px'}
              />
              <Avatar
                size={'xs'}
                name='Ryan Florence'
                src='https://bit.ly/ryan-florence'
                position={'absolute'}
                bottom={'0px'}
                left={'0px'}
                padding={'2px'}
              />
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={'column'} gap={2}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Flex w={'full'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  {' '}
                  mark zuckerberg
                </Text>
                <Image src='/verified.png' w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={'center'}>
                <Text fontSize={'sm'} color={'gray'}>
                  1d
                </Text>
                <BsThreeDots />
              </Flex>
            </Flex>
            <Text fontSize={'sm'}>{postTitle}</Text>
            {postImage && (
              <Box
                borderRadius={6}
                overflow={'hidden'}
                border={'1px solid gray'}
              >
                <Image src={postImage} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions liked={liked} setLiked={setLiked} />
            </Flex>

            <Flex gap={2} alignItems={'center'}>
              <Text color={'gray'} fontSize='sm'>
                {replies} replies
              </Text>
              <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray'}></Box>
              <Text color={'gray'} fontSize='sm'>
                {likes} likes
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default UserPost;

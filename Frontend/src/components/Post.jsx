import { Avatar, Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postsAtom);

  //Fetch user who posted
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/profile/' + postedBy, {
          method: 'GET',
        });
        const data = await res.json();
        // console.log('Data of posts from Post component is: ', data);
        if (data.error) {
          console.log('Error is: ', data.error);
          showToast('Error', data.error, 'error');
          return;
        }
        setUser(data);
      } catch (err) {
        console.log('Err is: ', err);
        showToast('Error', err, 'error');
        setUser(null);
      }
    };

    fetchUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        console.log('Error in delete request is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', data.message, 'success');
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (err) {
      console.log('Err is: ', err);
      showToast('Error', err, 'error');
    }
  };

  if (!user) {
    return null;
  }
  return (
    <>
      <Link href={`/${user.userName}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Avatar
              size={'md'}
              name={user.name}
              src={user.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.userName}`);
              }}
            />
            <Box w={'1px'} h={'full'} bg={'gray'} my={2}></Box>
            <Box position={'relative'} w={'full'}>
              {post.replies.length === 0 && (
                <Text textAlign={'center'}>🤔</Text>
              )}
              {post.replies[0] && (
                <Avatar
                  size={'xs'}
                  name={post.replies[0].name}
                  src={post.replies[0].userProfilePic}
                  position={'absolute'}
                  top={'0px'}
                  left={'15px'}
                  padding={'2px'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${post.replies[0].userName}`);
                  }}
                />
              )}
              {post.replies[1] && (
                <Avatar
                  size={'xs'}
                  name={post.replies[1].name}
                  src={post.replies[1].userProfilePic}
                  position={'absolute'}
                  bottom={'0px'}
                  right={'0px'}
                  padding={'2px'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${post.replies[1].userName}`);
                  }}
                />
              )}
              {post.replies[2] && (
                <Avatar
                  size={'xs'}
                  name={post.replies[2].name}
                  src={post.replies[2].userProfilePic}
                  position={'absolute'}
                  bottom={'0px'}
                  left={'0px'}
                  padding={'2px'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${post.replies[2].userName}`);
                  }}
                />
              )}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={'column'} gap={2}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Flex w={'full'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  {' '}
                  {user.userName}
                </Text>
                <Image src='/verified.png' w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={'center'}>
                <Text
                  fontSize={'xs'}
                  width={36}
                  textAlign={'right'}
                  color={'gray'}
                >
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>
                {/* <BsThreeDots /> */}
                {currentUser?._id === user._id && (
                  <DeleteIcon onClick={handleDeletePost} />
                )}
              </Flex>
            </Flex>
            <Text fontSize={'sm'}>{post.text}</Text>
            {post.image && (
              <Box
                borderRadius={6}
                overflow={'hidden'}
                border={'1px solid gray'}
              >
                <Image src={post.image} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default Post;

import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import { useNavigate, useParams } from 'react-router-dom';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import postsAtom from '../atoms/postsAtom';
import { Link as RouterLink } from 'react-router-dom';

const PostPage = () => {
  const { loading, user } = useGetUserProfile();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { pid } = useParams();
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`, {
          method: 'GET',
        });
        const data = await res.json();

        if (data.error) {
          console.log('Error in getting post is: ', data.eror);
          showToast('Error', data.error, 'error');
          return;
        }
        // console.log('Data from Get post is: ', data);
        setPosts([data]);
      } catch (err) {
        console.log('Err is: ', err);
        showToast('Error', err, 'error');
      }
    };

    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        console.log('Error in delete request is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', data.message, 'success');
      navigate(`/${currentUser.userName}`);
    } catch (err) {
      console.log('Err is: ', err);
      showToast('Error', err, 'error');
    }
  };
  if (!user && loading) {
    return (
      <>
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'} color='red.500' />
        </Flex>
      </>
    );
  }
  // console.log('Post details are: ', currentPost);

  if (!currentPost) {
    return null;
  }
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <RouterLink to={`/${user.userName}`}>
            <Avatar src={user.profilePic} size={'md'} name={user.name} />
          </RouterLink>

          <Flex>
            <Text fontSize={'small'} fontWeight={'bold'}>
              {' '}
              {user.userName}
            </Text>
            <Image src='/verified.png' width={4} height={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray'}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {/* <BsThreeDots /> */}
          {currentUser?._id === user._id && (
            <DeleteIcon onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>
      {currentPost.image && (
        <>
          <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray'}>
            <Image src={currentPost.image} />
          </Box>
        </>
      )}

      <Flex gap={3} my={3} cursor={'pointer'}>
        <Actions post={currentPost}></Actions>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>🫲</Text>
          <Text color={'gray'}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
      {/* <Comment
        comment='Looks really cool'
        createdAt='2d'
        likes={263}
        userName='danAbramov'
        userAvatar='https://bit.ly/dan-abramov'
      /> */}
    </>
  );
};

export default PostPage;

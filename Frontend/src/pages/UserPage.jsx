import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import CreatePost from '../components/CreatePost';

const UserPage = () => {
  const { loading, user } = useGetUserProfile();
  const currentUser = useRecoilValue(userAtom);
  const { username } = useParams();
  const showToast = useShowToast();

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingUserPosts, setFetchingUserPosts] = useState(true);
  useEffect(() => {
    const getUserPosts = async () => {
      setFetchingUserPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`, {
          method: 'GET',
        });
        const data = await res.json();
        // console.log('Posts from getUserPosts is: ', data);
        if (data.error) {
          console.log('Error is: ', data.error);
          showToast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (err) {
        console.log('Err is: ', err);
        showToast('Error', err, 'error');
        setPosts([]);
      } finally {
        setFetchingUserPosts(false);
      }
    };
    getUserPosts();
  }, [username, showToast, setPosts]);
  // console.log('User in UserPage is: ', user);
  // console.log('posts from recoil are: ', posts);
  // console.log('userName from currentUser atom is: ', currentUser.userName);
  // console.log('userName from params is: ', username);
  if (!user && loading) {
    return (
      <>
        <Flex justifyContent={'center'}>
          <Spinner color='red.500' size={'xl'} />
        </Flex>
      </>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <>
      {/* <div>UserPage</div> */}
      {fetchingUserPosts && (
        <>
          <Flex justifyContent={'center'}>
            <Spinner color='red.500' size={'xl'} />
          </Flex>
        </>
      )}
      <UserHeader user={user} />
      {!fetchingUserPosts && posts.length === 0 && (
        <>
          <h2>User has no posts.</h2>
        </>
      )}

      {posts.length &&
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}

      {currentUser.userName === username && <CreatePost />}
    </>
  );
};

export default UserPage;
